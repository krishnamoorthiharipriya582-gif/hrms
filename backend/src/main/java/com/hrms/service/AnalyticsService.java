package com.hrms.service;

import com.hrms.entity.*;
import com.hrms.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final EmployeeRepository employeeRepository;
    private final PayrollRunRepository payrollRunRepository;
    private final LeaveApplicationRepository leaveApplicationRepository;
    private final AttendanceRecordRepository attendanceRecordRepository;
    private final ExitRecordRepository exitRecordRepository;

    public AnalyticsService(EmployeeRepository employeeRepository,
                            PayrollRunRepository payrollRunRepository,
                            LeaveApplicationRepository leaveApplicationRepository,
                            AttendanceRecordRepository attendanceRecordRepository,
                            ExitRecordRepository exitRecordRepository) {
        this.employeeRepository = employeeRepository;
        this.payrollRunRepository = payrollRunRepository;
        this.leaveApplicationRepository = leaveApplicationRepository;
        this.attendanceRecordRepository = attendanceRecordRepository;
        this.exitRecordRepository = exitRecordRepository;
    }

    public Map<String, Object> getHeadcountAnalytics() {
        List<Employee> all = employeeRepository.findAll();
        long active = all.stream().filter(e -> "ACTIVE".equals(e.getStatus())).count();
        long notice = all.stream().filter(e -> "NOTICE_PERIOD".equals(e.getStatus())).count();
        long exited = all.stream().filter(e -> "EXITED".equals(e.getStatus())).count();

        Map<String, Long> byDepartment = all.stream()
                .filter(e -> "ACTIVE".equals(e.getStatus()))
                .collect(Collectors.groupingBy(
                        e -> e.getDepartment() != null ? e.getDepartment().getName() : "Unassigned",
                        Collectors.counting()
                ));

        Map<String, Long> byEmploymentType = all.stream()
                .filter(e -> "ACTIVE".equals(e.getStatus()))
                .collect(Collectors.groupingBy(Employee::getEmploymentType, Collectors.counting()));

        Map<String, Object> data = new HashMap<>();
        data.put("totalEmployees", all.size());
        data.put("activeCount", active);
        data.put("noticePeriodCount", notice);
        data.put("exitedCount", exited);
        data.put("byDepartment", byDepartment);
        data.put("byEmploymentType", byEmploymentType);
        return data;
    }

    public Map<String, Object> getPayrollCostAnalytics() {
        List<PayrollRun> runs = payrollRunRepository.findAll();
        List<Map<String, Object>> trend = new ArrayList<>();

        for (PayrollRun r : runs) {
            Map<String, Object> item = new HashMap<>();
            item.put("month", r.getRunMonth());
            item.put("grossCost", r.getTotalGross());
            item.put("netDisbursed", r.getTotalNet());
            item.put("pfDeduction", r.getTotalPf());
            item.put("tdsDeduction", r.getTotalTds());
            item.put("status", r.getStatus());
            trend.add(item);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("payrollTrend", trend);
        return result;
    }

    public List<Map<String, Object>> getComplianceCalendar() {
        List<Map<String, Object>> list = new ArrayList<>();

        Map<String, Object> item1 = new HashMap<>();
        item1.put("statutoryBody", "EPFO (Provident Fund)");
        item1.put("challanType", "Monthly ECR Return");
        item1.put("dueDate", "15th of every month");
        item1.put("status", "FILED");
        list.add(item1);

        Map<String, Object> item2 = new HashMap<>();
        item2.put("statutoryBody", "ESIC (State Insurance)");
        item2.put("challanType", "Monthly ESIC Challan");
        item2.put("dueDate", "15th of every month");
        item2.put("status", "FILED");
        list.add(item2);

        Map<String, Object> item3 = new HashMap<>();
        item3.put("statutoryBody", "Income Tax Dept (TRACES)");
        item3.put("challanType", "Quarterly TDS Form 24Q");
        item3.put("dueDate", "31st of month following quarter end");
        item3.put("status", "PENDING");
        list.add(item3);

        Map<String, Object> item4 = new HashMap<>();
        item4.put("statutoryBody", "Commercial Tax Dept");
        item4.put("challanType", "Professional Tax (PT) Return");
        item4.put("dueDate", "20th of every month");
        item4.put("status", "FILED");
        list.add(item4);

        return list;
    }
}
