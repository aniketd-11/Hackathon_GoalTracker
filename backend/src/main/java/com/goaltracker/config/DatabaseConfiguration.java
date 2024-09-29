package com.goaltracker.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories({
        "com.goaltracker.repository"
})
@EnableTransactionManagement
@EnableJpaAuditing
public class DatabaseConfiguration {
}
