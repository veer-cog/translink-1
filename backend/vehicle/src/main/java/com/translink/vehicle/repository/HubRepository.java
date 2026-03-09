package com.translink.vehicle.repository;

import com.translink.vehicle.model.Hub;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HubRepository extends JpaRepository<Hub, Long> {
    List<Hub> findByCompanyId(String companyId);
}