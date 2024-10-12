package com.goaltracker.repository;

import com.goaltracker.model.Project;
import com.goaltracker.model.TemplateTypes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project,Integer> {

    List<Project> findByAccount_AccountId(int accountId);
    List<Project> findByTemplateType(TemplateTypes templateTypes);

}
