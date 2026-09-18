package com.hrms.repository;

import com.hrms.entity.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, UUID> {
    Optional<AttendanceRecord> findByEmployeeIdAndWorkDate(UUID employeeId, LocalDate workDate);
    List<AttendanceRecord> findByEmployeeIdAndWorkDateBetween(UUID employeeId, LocalDate startDate, LocalDate endDate);
    List<AttendanceRecord> findByWorkDate(LocalDate workDate);
    List<AttendanceRecord> findByRegularisationStatus(String regularisationStatus);

    @Query("SELECT COUNT(a) FROM AttendanceRecord a WHERE a.employee.id = :empId AND a.status = 'LOP' AND a.workDate BETWEEN :startDate AND :endDate")
    long countLopDays(@Param("empId") UUID empId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
