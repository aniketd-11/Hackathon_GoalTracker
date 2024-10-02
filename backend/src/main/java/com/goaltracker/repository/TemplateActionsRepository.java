package com.goaltracker.repository;

import com.goaltracker.model.TemplateAction;
import com.goaltracker.model.TemplateTypes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TemplateActionsRepository extends JpaRepository<TemplateAction,Integer> {

    List<TemplateAction> findByTemplateTypes(TemplateTypes templateType);
}
