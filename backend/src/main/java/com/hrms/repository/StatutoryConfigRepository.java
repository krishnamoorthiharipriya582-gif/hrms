package com.hrms.repository;

import com.hrms.entity.StatutoryConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface StatutoryConfigRepository extends JpaRepository<StatutoryConfig, UUID> {
    Optional<StatutoryConfig> findByConfigKey(String configKey);
}
