package com.translink.AuditService.service;

import com.translink.audit.model.AuditLog;
import com.translink.AuditService.model.AuditLogEntity;
import com.translink.AuditService.repository.AuditRepository;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditRepository repository;

    public void saveLog(AuditLog dto) {
        AuditLogEntity entity = new AuditLogEntity();
        BeanUtils.copyProperties(dto, entity);
        entity.setCreatedAt(LocalDateTime.now());
        repository.save(entity);
    }

    public Page<AuditLogEntity> getLogsByUser(String userId, String companyId, Pageable pageable) {
        return repository.findByUserIdAndCompanyId(userId, companyId, pageable);
    }

    public Page<AuditLogEntity> getLogsWithFilters(
            String adminCompanyId,
            String search,
            String serviceName,
            Pageable pageable) {

        // Pass the parameters to the repository.
        // The Repository's @Query handles NULL checks for 'search' and 'serviceName'.
        return repository.findWithFilters(adminCompanyId, search, serviceName, pageable);
    }
}