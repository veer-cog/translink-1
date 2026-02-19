package com.translink.AuditService.repository;


import com.translink.AuditService.model.ActionCategory;
import com.translink.AuditService.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditRepository extends JpaRepository<AuditLog, Long> {

    // For Admin to see their team's activity
    Page<AuditLog> findByUserEmailIn(List<String> emails, Pageable pageable);

    // For Analytics: Filter by category within a team
    long countByCategoryAndUserEmailIn(ActionCategory category, List<String> emails);
}