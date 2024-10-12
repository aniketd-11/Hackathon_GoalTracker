-- Table: account
CREATE TABLE account (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    account_name VARCHAR(255) NOT NULL
);

-- Table: goal_tracker_action
CREATE TABLE goal_tracker_action (
    action_value_id INT AUTO_INCREMENT PRIMARY KEY,
    tracker_id INT NOT NULL,
    action_id INT NOT NULL,
    action_value VARCHAR(255),
    action_rating ENUM('RED', 'ORANGE', 'GREEN'),
    FOREIGN KEY (tracker_id) REFERENCES goal_tracker_master(tracker_id),
    FOREIGN KEY (action_id) REFERENCES template_actions(action_id)
);

-- Table: goal_tracker_master
CREATE TABLE goal_tracker_master (
    tracker_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    goal_tracker_name VARCHAR(255),
    start_date DATETIME,
    end_date DATETIME,
    status VARCHAR(50),
    rating VARCHAR(50),
    is_latest TINYINT(1),
    FOREIGN KEY (project_id) REFERENCES project(project_id)
);

-- Table: project
CREATE TABLE project (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    template_type ENUM('FIXED_BID', 'STAFFING', 'T_M') NOT NULL,
    account_id INT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES account(account_id)
);

-- Table: role
CREATE TABLE role (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(255) NOT NULL
);

-- Table: template_actions
CREATE TABLE template_actions (
    action_id INT AUTO_INCREMENT PRIMARY KEY,
    template_types ENUM('T_M', 'FIXED_BID', 'STAFFING') NOT NULL,
    action_name VARCHAR(255) NOT NULL,
    action_type ENUM('NUMERIC', 'PERCENTAGE', 'COUNT', 'OPTION') NOT NULL,
    benchmark_value VARCHAR(255),
    comparison_operator ENUM('GREATER_THAN_EQUAL', 'LESS_THAN_EQUAL', 'EQUAL', 'NOT_EQUAL'),
    additional_info VARCHAR(255),
    created_at DATETIME,
    action_options VARCHAR(255),
    action_category ENUM('MAJOR', 'MINOR', 'OTHER')
);

-- Table: user
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES role(role_id)
);

-- Table: user_project_mapping
CREATE TABLE user_project_mapping (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES project(project_id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);
