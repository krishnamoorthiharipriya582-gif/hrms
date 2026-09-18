package com.hrms.service;

import com.hrms.dto.EmployeeDto;
import com.hrms.entity.*;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.DepartmentRepository;
import com.hrms.repository.EmployeeRepository;
import com.hrms.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    public EmployeeService(EmployeeRepository employeeRepository,
                           DepartmentRepository departmentRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           AuditService auditService) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(UUID id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    public Optional<Employee> getEmployeeByEmail(String email) {
        return employeeRepository.findByEmail(email);
    }

    public List<Employee> searchEmployees(String query) {
        if (query == null || query.trim().isEmpty()) {
            return employeeRepository.findAll();
        }
        return employeeRepository.searchEmployees(query.trim());
    }

    @Transactional
    public Employee createEmployee(EmployeeDto dto, String actorEmail) {
        Employee employee = new Employee();
        employee.setEmpCode(dto.getEmpCode() != null ? dto.getEmpCode() : "EMP" + System.currentTimeMillis() % 100000);
        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setPersonalEmail(dto.getPersonalEmail());
        employee.setPhone(dto.getPhone());
        employee.setEmergencyContact(dto.getEmergencyContact());
        employee.setDesignation(dto.getDesignation());
        employee.setGrade(dto.getGrade() != null ? dto.getGrade() : "L2");
        employee.setEmploymentType(dto.getEmploymentType() != null ? dto.getEmploymentType() : "PERMANENT");
        employee.setStatus(dto.getStatus() != null ? dto.getStatus() : "ACTIVE");
        employee.setDateOfJoining(dto.getDateOfJoining() != null ? dto.getDateOfJoining() : LocalDate.now());
        employee.setDateOfBirth(dto.getDateOfBirth());
        employee.setPan(dto.getPan());
        employee.setAadhaarMasked(dto.getAadhaarMasked());
        employee.setBankAccount(dto.getBankAccount());
        employee.setIfsc(dto.getIfsc());
        employee.setBankName(dto.getBankName());
        employee.setAddress(dto.getAddress());
        employee.setCtc(dto.getCtc() != null ? dto.getCtc() : BigDecimal.ZERO);
        employee.setTaxRegime(dto.getTaxRegime() != null ? dto.getTaxRegime() : "NEW");
        employee.setProbationEndDate(employee.getDateOfJoining().plusDays(90));

        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(dto.getDepartmentId())
                    .orElse(null);
            employee.setDepartment(dept);
        }

        if (dto.getManagerId() != null) {
            Employee mgr = employeeRepository.findById(dto.getManagerId())
                    .orElse(null);
            employee.setManager(mgr);
        }

        Employee saved = employeeRepository.save(employee);

        // Auto-create user account if not exists
        if (!userRepository.existsByUsername(saved.getEmail())) {
            User user = new User();
            user.setUsername(saved.getEmail());
            user.setPassword(passwordEncoder.encode("Welcome@123"));
            user.setRole(Role.ROLE_EMPLOYEE);
            user.setEmployeeId(saved.getId());
            user.setActive(true);
            userRepository.save(user);
        }

        auditService.log(null, actorEmail, "CREATE_EMPLOYEE", "Employee", saved.getId().toString(), "Created employee: " + saved.getFullName());
        return saved;
    }

    @Transactional
    public Employee updateEmployee(UUID id, EmployeeDto dto, String actorEmail) {
        Employee emp = getEmployeeById(id);
        if (dto.getFirstName() != null) emp.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) emp.setLastName(dto.getLastName());
        if (dto.getPhone() != null) emp.setPhone(dto.getPhone());
        if (dto.getEmergencyContact() != null) emp.setEmergencyContact(dto.getEmergencyContact());
        if (dto.getDesignation() != null) emp.setDesignation(dto.getDesignation());
        if (dto.getGrade() != null) emp.setGrade(dto.getGrade());
        if (dto.getEmploymentType() != null) emp.setEmploymentType(dto.getEmploymentType());
        if (dto.getStatus() != null) emp.setStatus(dto.getStatus());
        if (dto.getAddress() != null) emp.setAddress(dto.getAddress());
        if (dto.getBankAccount() != null) emp.setBankAccount(dto.getBankAccount());
        if (dto.getIfsc() != null) emp.setIfsc(dto.getIfsc());
        if (dto.getBankName() != null) emp.setBankName(dto.getBankName());
        if (dto.getCtc() != null) emp.setCtc(dto.getCtc());
        if (dto.getTaxRegime() != null) emp.setTaxRegime(dto.getTaxRegime());

        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(dto.getDepartmentId()).orElse(null);
            emp.setDepartment(dept);
        }
        if (dto.getManagerId() != null) {
            Employee mgr = employeeRepository.findById(dto.getManagerId()).orElse(null);
            emp.setManager(mgr);
        }

        Employee updated = employeeRepository.save(emp);
        auditService.log(null, actorEmail, "UPDATE_EMPLOYEE", "Employee", updated.getId().toString(), "Updated employee details");
        return updated;
    }

    public List<Map<String, Object>> getOrgHierarchy() {
        List<Employee> all = employeeRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Employee e : all) {
            Map<String, Object> node = new HashMap<>();
            node.put("id", e.getId());
            node.put("name", e.getFullName());
            node.put("designation", e.getDesignation());
            node.put("department", e.getDepartment() != null ? e.getDepartment().getName() : "Unassigned");
            node.put("managerId", e.getManager() != null ? e.getManager().getId() : null);
            node.put("managerName", e.getManager() != null ? e.getManager().getFullName() : "None");
            node.put("status", e.getStatus());
            result.add(node);
        }
        return result;
    }

    @Transactional
    public void updateTaxRegime(UUID employeeId, String regime) {
        Employee emp = getEmployeeById(employeeId);
        emp.setTaxRegime(regime);
        employeeRepository.save(emp);
    }
}
