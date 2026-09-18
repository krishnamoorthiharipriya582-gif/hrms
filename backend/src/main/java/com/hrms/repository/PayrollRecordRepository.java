package com.hrms.repository;

import com.hrms.entity.PayrollRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PayrollRecordRepository extends JpaRepository<PayrollRecord, UUID> {
    List<PayrollRecord> findByPayrollRunId(UUID payrollRunId);
    Optional<PayrollRecord> findByPayrollRunIdAndEmployeeId(UUID payrollRunId, UUID employeeId);
    Optional<PayrollRecord> findByPayrollRunRunMonthAndEmployeeId(String runMonth, UUID employeeId);
    List<PayrollRecord> findByEmployeeIdOrderByPayrollRunRunMonthDesc(UUID employeeId);
}
