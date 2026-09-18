package com.hrms.repository;

import com.hrms.entity.LeaveBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, UUID> {
    List<LeaveBalance> findByEmployeeIdAndFinancialYear(UUID employeeId, String financialYear);
    Optional<LeaveBalance> findByEmployeeIdAndLeaveTypeAndFinancialYear(UUID employeeId, String leaveType, String financialYear);
}
