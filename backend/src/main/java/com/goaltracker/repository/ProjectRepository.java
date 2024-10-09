package com.goaltracker.repository;

import com.goaltracker.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project,Integer> {

    List<Project> findByAccount_AccountId(int accountId);

}
