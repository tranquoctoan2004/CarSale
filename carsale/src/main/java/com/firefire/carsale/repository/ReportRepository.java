package com.firefire.carsale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.firefire.carsale.entity.Report;
import com.firefire.carsale.entity.enums.ReportStatus;
import com.firefire.carsale.entity.enums.ReportType;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {

       List<Report> findByAdminAccountId(Integer adminId);

       List<Report> findByReportType(ReportType reportType);

       List<Report> findByStatus(ReportStatus status);

       @Query("""
                         SELECT r FROM Report r
                         WHERE (:reportType IS NULL OR r.reportType = :reportType)
                           AND (:status IS NULL OR r.status = :status)
                           AND (:startDate IS NULL OR r.createdAt >= :startDate)
                           AND (:endDate IS NULL OR r.createdAt <= :endDate)
                         ORDER BY r.createdAt DESC
                     """)
       org.springframework.data.domain.Page<Report> searchReports(
                     @Param("reportType") ReportType reportType,
                     @Param("status") ReportStatus status,
                     @Param("startDate") LocalDateTime startDate,
                     @Param("endDate") LocalDateTime endDate,
                     org.springframework.data.domain.Pageable pageable);
}
