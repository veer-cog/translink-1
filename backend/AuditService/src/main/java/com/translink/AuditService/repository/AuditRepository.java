package com.translink.AuditService.repository;

import com.translink.AuditService.model.AuditLogEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditRepository extends JpaRepository<AuditLogEntity, Long> {
    @Query("SELECT a FROM AuditLogEntity a WHERE a.companyId = :companyId " +
            "AND (:search IS NULL OR LOWER(a.userEmail) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(a.endpoint) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:serviceName IS NULL OR a.serviceName = :serviceName)")
    Page<AuditLogEntity> findWithFilters(
            @Param("companyId") String companyId,
            @Param("search") String search,
            @Param("serviceName") String serviceName,
            Pageable pageable);
    Page<AuditLogEntity> findByCompanyId(String companyId, Pageable pageable);

    Page<AuditLogEntity> findByUserIdAndCompanyId(String userId, String companyId, Pageable pageable);
}