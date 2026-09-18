package com.hrms.config;

import com.hrms.entity.*;
import com.hrms.repository.*;
import com.hrms.service.PayrollService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final SalaryStructureRepository salaryStructureRepository;
    private final ShiftRepository shiftRepository;
    private final HolidayRepository holidayRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final LeaveApplicationRepository leaveApplicationRepository;
    private final AttendanceRecordRepository attendanceRecordRepository;
    private final CandidateOnboardingRepository candidateOnboardingRepository;
    private final TrainingRecordRepository trainingRecordRepository;
    private final StatutoryConfigRepository statutoryConfigRepository;
    private final AppraisalRepository appraisalRepository;
    private final ExitRecordRepository exitRecordRepository;
    private final PasswordEncoder passwordEncoder;
    private final PayrollService payrollService;

    public DataSeeder(UserRepository userRepository,
                      DepartmentRepository departmentRepository,
                      EmployeeRepository employeeRepository,
                      SalaryStructureRepository salaryStructureRepository,
                      ShiftRepository shiftRepository,
                      HolidayRepository holidayRepository,
                      LeaveBalanceRepository leaveBalanceRepository,
                      LeaveApplicationRepository leaveApplicationRepository,
                      AttendanceRecordRepository attendanceRecordRepository,
                      CandidateOnboardingRepository candidateOnboardingRepository,
                      TrainingRecordRepository trainingRecordRepository,
                      StatutoryConfigRepository statutoryConfigRepository,
                      AppraisalRepository appraisalRepository,
                      ExitRecordRepository exitRecordRepository,
                      PasswordEncoder passwordEncoder,
                      PayrollService payrollService) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.employeeRepository = employeeRepository;
        this.salaryStructureRepository = salaryStructureRepository;
        this.shiftRepository = shiftRepository;
        this.holidayRepository = holidayRepository;
        this.leaveBalanceRepository = leaveBalanceRepository;
        this.leaveApplicationRepository = leaveApplicationRepository;
        this.attendanceRecordRepository = attendanceRecordRepository;
        this.candidateOnboardingRepository = candidateOnboardingRepository;
        this.trainingRecordRepository = trainingRecordRepository;
        this.statutoryConfigRepository = statutoryConfigRepository;
        this.appraisalRepository = appraisalRepository;
        this.exitRecordRepository = exitRecordRepository;
        this.passwordEncoder = passwordEncoder;
        this.payrollService = payrollService;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {

        // 1. Departments
        Department eng = departmentRepository.save(new Department("Engineering", "ENG", "Core Software Engineering & DevOps"));
        Department hr = departmentRepository.save(new Department("Human Resources", "HR", "Talent Acquisition & Employee Engagement"));
        Department fin = departmentRepository.save(new Department("Finance & Accounts", "FIN", "Corporate Finance, Audit, and Payroll"));
        Department prd = departmentRepository.save(new Department("Product & Design", "PRD", "Product Strategy and UI/UX Design"));

        // 2. Salary Structures
        salaryStructureRepository.save(new SalaryStructure("L1", LocalDate.of(2025, 1, 1), new BigDecimal("40.00"), new BigDecimal("20.00"), new BigDecimal("1600.00"), new BigDecimal("40.00")));
        salaryStructureRepository.save(new SalaryStructure("L2", LocalDate.of(2025, 1, 1), new BigDecimal("40.00"), new BigDecimal("20.00"), new BigDecimal("1600.00"), new BigDecimal("40.00")));
        salaryStructureRepository.save(new SalaryStructure("L3", LocalDate.of(2025, 1, 1), new BigDecimal("40.00"), new BigDecimal("20.00"), new BigDecimal("1600.00"), new BigDecimal("40.00")));
        salaryStructureRepository.save(new SalaryStructure("M1", LocalDate.of(2025, 1, 1), new BigDecimal("40.00"), new BigDecimal("20.00"), new BigDecimal("1600.00"), new BigDecimal("40.00")));

        // 3. Shifts
        shiftRepository.save(new Shift("General Shift", LocalTime.of(9, 30), LocalTime.of(18, 30), 15));
        shiftRepository.save(new Shift("Morning Shift", LocalTime.of(7, 0), LocalTime.of(16, 0), 15));
        shiftRepository.save(new Shift("Evening Shift", LocalTime.of(14, 0), LocalTime.of(23, 0), 15));

        // 4. Holidays
        holidayRepository.save(new Holiday(LocalDate.of(2026, 1, 26), "Republic Day", "NATIONAL"));
        holidayRepository.save(new Holiday(LocalDate.of(2026, 5, 1), "May Day / Workers Day", "STATE"));
        holidayRepository.save(new Holiday(LocalDate.of(2026, 8, 15), "Independence Day", "NATIONAL"));
        holidayRepository.save(new Holiday(LocalDate.of(2026, 10, 2), "Gandhi Jayanti", "NATIONAL"));
        holidayRepository.save(new Holiday(LocalDate.of(2026, 11, 8), "Diwali (Deepavali)", "NATIONAL"));
        holidayRepository.save(new Holiday(LocalDate.of(2026, 12, 25), "Christmas", "NATIONAL"));

        // 5. Employees
        // HR Admin
        Employee empHr = new Employee();
        empHr.setEmpCode("EMP001");
        empHr.setFirstName("Sarah");
        empHr.setLastName("Jenkins");
        empHr.setEmail("admin@hrms.com");
        empHr.setPersonalEmail("sarah.jenkins@gmail.com");
        empHr.setPhone("+91 98765 43210");
        empHr.setEmergencyContact("+91 98765 43219");
        empHr.setDesignation("Chief People Officer");
        empHr.setDepartment(hr);
        empHr.setGrade("M1");
        empHr.setEmploymentType("PERMANENT");
        empHr.setStatus("ACTIVE");
        empHr.setDateOfJoining(LocalDate.of(2023, 3, 1));
        empHr.setDateOfBirth(LocalDate.of(1988, 5, 14));
        empHr.setPan("AAACJ1234K");
        empHr.setAadhaarMasked("XXXX-XXXX-4589");
        empHr.setBankAccount("918273645012");
        empHr.setIfsc("HDFC0001234");
        empHr.setBankName("HDFC Bank");
        empHr.setAddress("42, Palm Meadows, Whitefield, Bengaluru");
        empHr.setCtc(new BigDecimal("2400000.00"));
        empHr.setTaxRegime("NEW");
        empHr = employeeRepository.save(empHr);

        // Department Manager
        Employee empMgr = new Employee();
        empMgr.setEmpCode("EMP002");
        empMgr.setFirstName("Rajesh");
        empMgr.setLastName("Sharma");
        empMgr.setEmail("manager@hrms.com");
        empMgr.setPersonalEmail("rajesh.sharma@gmail.com");
        empMgr.setPhone("+91 98111 22334");
        empMgr.setEmergencyContact("+91 98111 22335");
        empMgr.setDesignation("Director of Engineering");
        empMgr.setDepartment(eng);
        empMgr.setGrade("M1");
        empMgr.setEmploymentType("PERMANENT");
        empMgr.setStatus("ACTIVE");
        empMgr.setDateOfJoining(LocalDate.of(2023, 6, 15));
        empMgr.setDateOfBirth(LocalDate.of(1986, 9, 21));
        empMgr.setPan("BKAPS8899Z");
        empMgr.setAadhaarMasked("XXXX-XXXX-7712");
        empMgr.setBankAccount("405928371928");
        empMgr.setIfsc("ICIC0000456");
        empMgr.setBankName("ICICI Bank");
        empMgr.setAddress("704, Skyline Towers, Indiranagar, Bengaluru");
        empMgr.setCtc(new BigDecimal("2200000.00"));
        empMgr.setTaxRegime("NEW");
        empMgr = employeeRepository.save(empMgr);

        // Staff Employee 1
        Employee empStaff = new Employee();
        empStaff.setEmpCode("EMP003");
        empStaff.setFirstName("Priya");
        empStaff.setLastName("Verma");
        empStaff.setEmail("emp@hrms.com");
        empStaff.setPersonalEmail("priya.verma@gmail.com");
        empStaff.setPhone("+91 97222 33445");
        empStaff.setEmergencyContact("+91 97222 33446");
        empStaff.setDesignation("Senior Full Stack Engineer");
        empStaff.setDepartment(eng);
        empStaff.setManager(empMgr);
        empStaff.setGrade("L3");
        empStaff.setEmploymentType("PERMANENT");
        empStaff.setStatus("ACTIVE");
        empStaff.setDateOfJoining(LocalDate.of(2024, 1, 10));
        empStaff.setDateOfBirth(LocalDate.of(1994, 11, 2));
        empStaff.setPan("CPVPV9090L");
        empStaff.setAadhaarMasked("XXXX-XXXX-3341");
        empStaff.setBankAccount("601928374615");
        empStaff.setIfsc("SBIN0001002");
        empStaff.setBankName("State Bank of India");
        empStaff.setAddress("201, Green Glen Layout, Bellandur, Bengaluru");
        empStaff.setCtc(new BigDecimal("1500000.00"));
        empStaff.setTaxRegime("NEW");
        empStaff = employeeRepository.save(empStaff);

        // Staff Employee 2
        Employee empDev = new Employee();
        empDev.setEmpCode("EMP004");
        empDev.setFirstName("Amit");
        empDev.setLastName("Patel");
        empDev.setEmail("amit.patel@hrms.com");
        empDev.setPersonalEmail("amit.patel@gmail.com");
        empDev.setPhone("+91 96333 44556");
        empDev.setDesignation("Backend Engineer");
        empDev.setDepartment(eng);
        empDev.setManager(empMgr);
        empDev.setGrade("L2");
        empDev.setEmploymentType("PERMANENT");
        empDev.setStatus("ACTIVE");
        empDev.setDateOfJoining(LocalDate.of(2024, 4, 1));
        empDev.setDateOfBirth(LocalDate.of(1996, 7, 18));
        empDev.setPan("DPKAP4455M");
        empDev.setAadhaarMasked("XXXX-XXXX-8923");
        empDev.setBankAccount("554433221100");
        empDev.setIfsc("HDFC0001234");
        empDev.setBankName("HDFC Bank");
        empDev.setAddress("B-302, HSR Layout Sector 2, Bengaluru");
        empDev.setCtc(new BigDecimal("960000.00"));
        empDev.setTaxRegime("NEW");
        empDev = employeeRepository.save(empDev);

        // 6. Users for Authentication
        userRepository.save(new User("admin@hrms.com", passwordEncoder.encode("admin123"), Role.ROLE_HR_MANAGER, empHr.getId()));
        userRepository.save(new User("manager@hrms.com", passwordEncoder.encode("manager123"), Role.ROLE_DEPT_MANAGER, empMgr.getId()));
        userRepository.save(new User("emp@hrms.com", passwordEncoder.encode("employee123"), Role.ROLE_EMPLOYEE, empStaff.getId()));
        userRepository.save(new User("amit@hrms.com", passwordEncoder.encode("employee123"), Role.ROLE_EMPLOYEE, empDev.getId()));

        // 7. Leave Balances for Employees
        List<Employee> allEmployees = List.of(empHr, empMgr, empStaff, empDev);
        for (Employee e : allEmployees) {
            leaveBalanceRepository.save(new LeaveBalance(e, "CL", "2026-2027", new BigDecimal("12.0"), BigDecimal.ZERO, BigDecimal.ZERO));
            leaveBalanceRepository.save(new LeaveBalance(e, "SL", "2026-2027", new BigDecimal("10.0"), BigDecimal.ZERO, BigDecimal.ONE));
            leaveBalanceRepository.save(new LeaveBalance(e, "EL", "2026-2027", new BigDecimal("15.0"), BigDecimal.ZERO, new BigDecimal("2.0")));
            leaveBalanceRepository.save(new LeaveBalance(e, "COMP_OFF", "2026-2027", new BigDecimal("2.0"), BigDecimal.ZERO, BigDecimal.ZERO));
        }

        // 8. Sample Attendance
        LocalDate today = LocalDate.now();
        attendanceRecordRepository.save(new AttendanceRecord(empStaff, today.minusDays(1), LocalTime.of(9, 25), LocalTime.of(18, 35), "BIOMETRIC", "PRESENT"));
        attendanceRecordRepository.save(new AttendanceRecord(empStaff, today.minusDays(2), LocalTime.of(9, 30), LocalTime.of(18, 30), "BIOMETRIC", "PRESENT"));
        attendanceRecordRepository.save(new AttendanceRecord(empStaff, today.minusDays(3), LocalTime.of(10, 05), LocalTime.of(18, 40), "BIOMETRIC", "LATE"));
        attendanceRecordRepository.save(new AttendanceRecord(empDev, today.minusDays(1), LocalTime.of(9, 20), LocalTime.of(18, 30), "MOBILE", "PRESENT"));

        // 9. Sample Pending Leave Application
        LeaveApplication pendingLeave = new LeaveApplication(
                empStaff,
                "CL",
                today.plusDays(3),
                today.plusDays(4),
                new BigDecimal("2.0"),
                "Attending family wedding ceremony in hometown"
        );
        leaveApplicationRepository.save(pendingLeave);

        // 10. Sample Candidate in Onboarding pipeline
        CandidateOnboarding candidate = new CandidateOnboarding(
                "Rohan Malhotra",
                "rohan.malhotra@gmail.com",
                "+91 99887 76655",
                "DevOps Cloud Specialist",
                "Engineering",
                new BigDecimal("1600000.00"),
                today.plusDays(14)
        );
        candidate.setESignStatus("SIGNED");
        candidate.setBgvStatus("INITIATED");
        candidate.setIdProofSubmitted(true);
        candidate.setEducationSubmitted(true);
        candidateOnboardingRepository.save(candidate);

        // 11. Sample Training Record
        trainingRecordRepository.save(new TrainingRecord(
                "POSH Compliance & Safe Workplace 2026",
                "Advocate Sunita Rao",
                today.plusDays(5),
                "ONLINE",
                empStaff
        ));

        // 12. Seed previous month payroll
        try {
            payrollService.computePayroll("2026-07", "system_seed");
            PayrollRun julRun = payrollService.getRunByMonth("2026-07").orElse(null);
            if (julRun != null) {
                payrollService.approvePayroll(julRun.getId(), "admin@hrms.com");
                payrollService.disbursePayroll(julRun.getId(), "admin@hrms.com");
            }
        } catch (Exception ignored) {}
        } // end if (userRepository.count() == 0)

        // 13. Ensure Super Admin user exists for RBAC (SRS Appendix A)
        if (!userRepository.existsByUsername("superadmin@hrms.com")) {
            userRepository.save(new User("superadmin@hrms.com", passwordEncoder.encode("superadmin123"), Role.ROLE_SUPER_ADMIN, null));
        }

        // 14. Statutory Rates and Ceilings (SRS Section 4.12, Section 5.5, Appendix B & D)
        if (statutoryConfigRepository.count() == 0) {
            statutoryConfigRepository.save(new StatutoryConfig("PF_EMPLOYEE_PERCENT", "12", "Statutory Provident Fund Employee Contribution Rate (%)"));
            statutoryConfigRepository.save(new StatutoryConfig("PF_EMPLOYER_PERCENT", "12", "Statutory Provident Fund Employer Contribution Rate (EPS 8.33% + EPF 3.67%) (%)"));
            statutoryConfigRepository.save(new StatutoryConfig("ESI_EMPLOYEE_PERCENT", "0.75", "Employees State Insurance Employee Contribution Rate (%)"));
            statutoryConfigRepository.save(new StatutoryConfig("ESI_EMPLOYER_PERCENT", "3.25", "Employees State Insurance Employer Contribution Rate (%)"));
            statutoryConfigRepository.save(new StatutoryConfig("PF_WAGE_CEILING", "15000.00", "Monthly basic wage ceiling for mandatory PF contribution calculation"));
            statutoryConfigRepository.save(new StatutoryConfig("ESI_GROSS_CEILING", "21000.00", "Monthly gross ceiling for statutory ESI eligibility"));
            statutoryConfigRepository.save(new StatutoryConfig("LOP_WORKING_DAYS", "26", "Denominator days divisor for Loss of Pay per-day salary deduction"));
            statutoryConfigRepository.save(new StatutoryConfig("STANDARD_DEDUCTION", "75000.00", "Standard income tax deduction under new tax regime FY 2026"));
            statutoryConfigRepository.save(new StatutoryConfig("PT_TAX_SLAB", "200.00", "Monthly Professional Tax deducted for salary exceeding state threshold"));
        }

        // 15. Sample Appraisals for Performance & Bell Curve (SRS FR7)
        if (appraisalRepository.count() == 0) {
            List<Employee> emps = employeeRepository.findAll();
            for (Employee e : emps) {
                if ("EMP001".equals(e.getEmpCode())) {
                    Appraisal a = new Appraisal(e, "2025-2026");
                    a.setEmployeeRating(new BigDecimal("4.8"));
                    a.setManagerRating(new BigDecimal("4.9"));
                    a.setFinalRating(new BigDecimal("4.9"));
                    a.setIncrementPct(new BigDecimal("12.00"));
                    a.setStatus("CLOSED");
                    a.setFeedback("Exceptional strategic leadership and HR transformation execution.");
                    a.setGoalsJson("[{\"kpi\":\"Talent Acquisition SLA < 30 days\",\"target\":\"95%\",\"achieved\":\"98%\"}]");
                    appraisalRepository.save(a);
                } else if ("EMP002".equals(e.getEmpCode())) {
                    Appraisal a = new Appraisal(e, "2025-2026");
                    a.setEmployeeRating(new BigDecimal("4.5"));
                    a.setManagerRating(new BigDecimal("4.6"));
                    a.setFinalRating(new BigDecimal("4.5"));
                    a.setIncrementPct(new BigDecimal("10.00"));
                    a.setStatus("HR_NORM");
                    a.setFeedback("Exceeded engineering milestones and uptime targets.");
                    a.setGoalsJson("[{\"kpi\":\"System Availability 99.9%\",\"target\":\"99.9%\",\"achieved\":\"99.95%\"}]");
                    appraisalRepository.save(a);
                } else if ("EMP003".equals(e.getEmpCode())) {
                    Appraisal a = new Appraisal(e, "2025-2026");
                    a.setEmployeeRating(new BigDecimal("4.0"));
                    a.setManagerRating(new BigDecimal("4.2"));
                    a.setStatus("MANAGER_REVIEW");
                    a.setFeedback("Self: High velocity feature delivery | Manager: Strong ownership of core payment modules.");
                    a.setGoalsJson("[{\"kpi\":\"Spring Boot Microservices Refactor\",\"target\":\"100%\",\"achieved\":\"95%\"}]");
                    appraisalRepository.save(a);
                } else if ("EMP004".equals(e.getEmpCode())) {
                    Appraisal a = new Appraisal(e, "2025-2026");
                    a.setEmployeeRating(new BigDecimal("3.5"));
                    a.setStatus("MID_YEAR");
                    a.setFeedback("Mid-year check-in: Making steady progress on automated tests.");
                    a.setGoalsJson("[{\"kpi\":\"Automated Integration Tests\",\"target\":\"80%\",\"achieved\":\"65%\"}]");
                    appraisalRepository.save(a);
                }
            }
        }

        // 16. Sample Exit Record for Clearance & FnF Workflow (SRS FR10)
        if (exitRecordRepository.count() == 0) {
            employeeRepository.findByEmpCode("EMP004").ifPresent(emp -> {
                ExitRecord exit = new ExitRecord();
                exit.setEmployee(emp);
                exit.setResignationDate(LocalDate.now().minusDays(20));
                exit.setLastWorkingDay(LocalDate.now().plusDays(40));
                exit.setNoticePeriodDays(60);
                exit.setExitType("RESIGNATION");
                exit.setExitInterviewNotes("Pursuing MS in Computer Science abroad");
                exit.setItClearance(true);
                exit.setAdminClearance(true);
                exit.setFinanceClearance(false);
                exit.setHrClearance(false);
                exit.setFnfAmount(new BigDecimal("78400.00"));
                exit.setFnfStatus("COMPUTED");
                exitRecordRepository.save(exit);
            });
        }
    }
}
