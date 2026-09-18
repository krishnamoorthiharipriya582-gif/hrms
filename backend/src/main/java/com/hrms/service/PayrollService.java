package com.hrms.service;

import com.hrms.entity.*;
import com.hrms.exception.PayrollAlreadyRunException;
import com.hrms.exception.PayrollLockedException;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;

@Service
public class PayrollService {

    private final PayrollRunRepository payrollRunRepository;
    private final PayrollRecordRepository payrollRecordRepository;
    private final EmployeeRepository employeeRepository;
    private final SalaryStructureRepository salaryStructureRepository;
    private final AttendanceRecordRepository attendanceRecordRepository;
    private final AuditService auditService;

    public PayrollService(PayrollRunRepository payrollRunRepository,
                          PayrollRecordRepository payrollRecordRepository,
                          EmployeeRepository employeeRepository,
                          SalaryStructureRepository salaryStructureRepository,
                          AttendanceRecordRepository attendanceRecordRepository,
                          AuditService auditService) {
        this.payrollRunRepository = payrollRunRepository;
        this.payrollRecordRepository = payrollRecordRepository;
        this.employeeRepository = employeeRepository;
        this.salaryStructureRepository = salaryStructureRepository;
        this.attendanceRecordRepository = attendanceRecordRepository;
        this.auditService = auditService;
    }

    public List<PayrollRun> getAllRuns() {
        return payrollRunRepository.findAll();
    }

    public PayrollRun getRunById(UUID runId) {
        return payrollRunRepository.findById(runId)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll run not found: " + runId));
    }

    public Optional<PayrollRun> getRunByMonth(String runMonth) {
        return payrollRunRepository.findByRunMonth(runMonth);
    }

    public List<PayrollRecord> getRecordsByRunId(UUID runId) {
        return payrollRecordRepository.findByPayrollRunId(runId);
    }

    public List<PayrollRecord> getEmployeePayslips(UUID employeeId) {
        return payrollRecordRepository.findByEmployeeIdOrderByPayrollRunRunMonthDesc(employeeId);
    }

    public PayrollRecord getEmployeePayslipForMonth(String runMonth, UUID employeeId) {
        return payrollRecordRepository.findByPayrollRunRunMonthAndEmployeeId(runMonth, employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Payslip not found for month " + runMonth));
    }

    @Transactional
    public PayrollRun computePayroll(String runMonth, String actorEmail) {
        Optional<PayrollRun> existing = payrollRunRepository.findByRunMonth(runMonth);
        if (existing.isPresent()) {
            PayrollRun currentRun = existing.get();
            if ("APPROVED".equalsIgnoreCase(currentRun.getStatus()) || "DISBURSED".equalsIgnoreCase(currentRun.getStatus())) {
                throw new PayrollAlreadyRunException("Payroll already processed and locked for month: " + runMonth);
            }
            // If DRAFT or PENDING_APPROVAL, clean up previous records for recompute
            List<PayrollRecord> oldRecords = payrollRecordRepository.findByPayrollRunId(currentRun.getId());
            payrollRecordRepository.deleteAll(oldRecords);
            payrollRunRepository.delete(currentRun);
        }

        PayrollRun run = new PayrollRun(runMonth, actorEmail);
        run = payrollRunRepository.save(run);

        YearMonth ym = YearMonth.parse(runMonth);
        LocalDate startOfMonth = ym.atDay(1);
        LocalDate endOfMonth = ym.atEndOfMonth();

        List<Employee> activeEmployees = employeeRepository.findByStatus("ACTIVE");
        List<PayrollRecord> records = new ArrayList<>();

        BigDecimal totalGross = BigDecimal.ZERO;
        BigDecimal totalNet = BigDecimal.ZERO;
        BigDecimal totalPf = BigDecimal.ZERO;
        BigDecimal totalTds = BigDecimal.ZERO;
        BigDecimal totalEsi = BigDecimal.ZERO;

        for (Employee emp : activeEmployees) {
            BigDecimal annualCtc = emp.getCtc() != null ? emp.getCtc() : BigDecimal.ZERO;
            if (annualCtc.compareTo(BigDecimal.ZERO) <= 0) {
                annualCtc = new BigDecimal("600000.00"); // default fallback 6 LPA
            }

            BigDecimal monthlyGross = annualCtc.divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);

            // Fetch Salary Structure or default
            SalaryStructure structure = salaryStructureRepository.findByGradeAndActiveTrue(emp.getGrade())
                    .orElse(null);

            BigDecimal basicPct = structure != null ? structure.getBasicPct().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP) : new BigDecimal("0.40");
            BigDecimal hraPct = structure != null ? structure.getHraPct().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP) : new BigDecimal("0.20");
            BigDecimal conveyance = structure != null ? structure.getConveyance() : new BigDecimal("1600.00");

            BigDecimal basic = monthlyGross.multiply(basicPct).setScale(2, RoundingMode.HALF_UP);
            BigDecimal hra = monthlyGross.multiply(hraPct).setScale(2, RoundingMode.HALF_UP);
            BigDecimal specialAllowance = monthlyGross.subtract(basic).subtract(hra).subtract(conveyance);
            if (specialAllowance.compareTo(BigDecimal.ZERO) < 0) {
                specialAllowance = BigDecimal.ZERO;
            }

            // LOP Calculation
            long lopCount = attendanceRecordRepository.countLopDays(emp.getId(), startOfMonth, endOfMonth);
            int lopDays = (int) lopCount;
            BigDecimal perDaySalary = monthlyGross.divide(BigDecimal.valueOf(26), 2, RoundingMode.HALF_UP);
            BigDecimal lopDeduction = perDaySalary.multiply(BigDecimal.valueOf(lopDays)).setScale(2, RoundingMode.HALF_UP);

            // Statutory: PF computation
            // Capped at Rs 15,000 ceiling per statutory rules
            BigDecimal pfCeiling = new BigDecimal("15000.00");
            BigDecimal pfEligibleSalary = basic.min(pfCeiling);
            BigDecimal employeePf = pfEligibleSalary.multiply(new BigDecimal("0.12")).setScale(2, RoundingMode.HALF_UP);
            BigDecimal employerPf = pfEligibleSalary.multiply(new BigDecimal("0.12")).setScale(2, RoundingMode.HALF_UP);

            // Statutory: ESI computation (Gross <= 21,000)
            BigDecimal esi = BigDecimal.ZERO;
            if (monthlyGross.compareTo(new BigDecimal("21000.00")) <= 0) {
                esi = monthlyGross.multiply(new BigDecimal("0.0075")).setScale(2, RoundingMode.HALF_UP);
            }

            // Professional Tax (PT): Rs 200 for gross > 15,000
            BigDecimal pt = monthlyGross.compareTo(new BigDecimal("15000.00")) > 0 ? new BigDecimal("200.00") : BigDecimal.ZERO;

            // TDS Computation: Simple projected tax based on annual gross
            BigDecimal estimatedAnnualTaxable = annualCtc.subtract(new BigDecimal("75000.00")); // Standard deduction
            BigDecimal monthlyTds = BigDecimal.ZERO;
            if (estimatedAnnualTaxable.compareTo(new BigDecimal("700000.00")) > 0) {
                BigDecimal taxableAboveSlab = estimatedAnnualTaxable.subtract(new BigDecimal("700000.00"));
                BigDecimal annualTds = taxableAboveSlab.multiply(new BigDecimal("0.10"));
                monthlyTds = annualTds.divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);
            }

            // Net Pay = Gross - (LOP + Employee PF + ESI + TDS + PT)
            BigDecimal totalDeductions = lopDeduction.add(employeePf).add(esi).add(monthlyTds).add(pt);
            BigDecimal netPay = monthlyGross.subtract(totalDeductions).setScale(2, RoundingMode.HALF_UP);
            if (netPay.compareTo(BigDecimal.ZERO) < 0) {
                netPay = BigDecimal.ZERO;
            }

            PayrollRecord rec = new PayrollRecord();
            rec.setPayrollRun(run);
            rec.setEmployee(emp);
            rec.setGross(monthlyGross);
            rec.setBasic(basic);
            rec.setHra(hra);
            rec.setConveyance(conveyance);
            rec.setSpecialAllowance(specialAllowance);
            rec.setLopDays(lopDays);
            rec.setLopDeduction(lopDeduction);
            rec.setEmployeePf(employeePf);
            rec.setEmployerPf(employerPf);
            rec.setEsi(esi);
            rec.setTds(monthlyTds);
            rec.setPt(pt);
            rec.setNetPay(netPay);
            rec.setDisbursementStatus("PENDING");

            records.add(rec);

            totalGross = totalGross.add(monthlyGross);
            totalNet = totalNet.add(netPay);
            totalPf = totalPf.add(employeePf);
            totalTds = totalTds.add(monthlyTds);
            totalEsi = totalEsi.add(esi);
        }

        payrollRecordRepository.saveAll(records);

        run.setTotalGross(totalGross);
        run.setTotalNet(totalNet);
        run.setTotalPf(totalPf);
        run.setTotalTds(totalTds);
        run.setTotalEsi(totalEsi);
        run.setStatus("PENDING_APPROVAL");
        PayrollRun savedRun = payrollRunRepository.save(run);

        auditService.log(null, actorEmail, "COMPUTE_PAYROLL", "PayrollRun", savedRun.getId().toString(),
                "Computed payroll for " + runMonth + " with total net: " + totalNet);
        return savedRun;
    }

    @Transactional
    public PayrollRun approvePayroll(UUID runId, String actorEmail) {
        PayrollRun run = getRunById(runId);
        if ("APPROVED".equalsIgnoreCase(run.getStatus()) || "DISBURSED".equalsIgnoreCase(run.getStatus())) {
            throw new PayrollLockedException("Payroll is already approved/locked");
        }

        run.setStatus("APPROVED");
        run.setApprovedBy(actorEmail);
        PayrollRun saved = payrollRunRepository.save(run);

        auditService.log(null, actorEmail, "APPROVE_PAYROLL", "PayrollRun", saved.getId().toString(),
                "Approved payroll run for month: " + run.getRunMonth());
        return saved;
    }

    @Transactional
    public PayrollRun disbursePayroll(UUID runId, String actorEmail) {
        PayrollRun run = getRunById(runId);
        if (!"APPROVED".equalsIgnoreCase(run.getStatus())) {
            throw new IllegalStateException("Payroll must be approved before disbursement");
        }

        run.setStatus("DISBURSED");
        List<PayrollRecord> records = payrollRecordRepository.findByPayrollRunId(runId);
        for (PayrollRecord r : records) {
            r.setDisbursementStatus("PAID");
            r.setDisbursementRef("RZP_PAY_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        payrollRecordRepository.saveAll(records);
        PayrollRun saved = payrollRunRepository.save(run);

        auditService.log(null, actorEmail, "DISBURSE_PAYROLL", "PayrollRun", saved.getId().toString(),
                "Disbursed salaries for month: " + run.getRunMonth());
        return saved;
    }
}
