package com.hrms.repository;

import com.hrms.entity.LeaveApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LeaveApplicationRepository extends JpaRepository<LeaveApplication, UUID> {
    List<LeaveApplication> findByEmployeeIdOrderByAppliedAtDesc(UUID employeeId);
    List<LeaveApplication> findByStatusOrderByAppliedAtDesc(String status);

    @Query("SELECT l FROM LeaveApplication l WHERE l.employee.manager.id = :managerId AND l.status = 'PENDING'")
    List<LeaveApplication> findPendingForManager(@Param("managerId") UUID managerId);
}
