package com.goaltracker.repository;

import com.goaltracker.model.UserProjectMapping;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserProjectMappingRepository extends JpaRepository<UserProjectMapping,Integer> {
    List<UserProjectMapping> findByUserId(int userId);
}
