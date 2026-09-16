-- Step 1: Create Database
CREATE DATABASE IF NOT EXISTS student_prediction;
USE student_prediction;

-- Step 2: Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    INDEX ix_users_id (id),
    INDEX ix_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Step 3: Student Profiles Table
CREATE TABLE IF NOT EXISTS student_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    attendance_pct FLOAT NULL,
    study_hours_week FLOAT NULL,
    assignment_score FLOAT NULL,
    internal_marks FLOAT NULL,
    prev_sem_cgpa FLOAT NULL,
    activity_score FLOAT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    INDEX ix_student_profiles_id (id),
    INDEX ix_student_profiles_user_id (user_id),
    CONSTRAINT fk_student_profiles_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Step 4: Predictions Table
CREATE TABLE IF NOT EXISTS predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    attendance_pct FLOAT NOT NULL,
    study_hours_week FLOAT NOT NULL,
    assignment_score FLOAT NOT NULL,
    internal_marks FLOAT NOT NULL,
    prev_sem_cgpa FLOAT NOT NULL,
    activity_score FLOAT NOT NULL,
    predicted_final_marks FLOAT NOT NULL,
    model_name VARCHAR(120) NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    INDEX ix_predictions_id (id),
    INDEX ix_predictions_user_id (user_id),
    INDEX ix_predictions_created_at (created_at),
    CONSTRAINT fk_predictions_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Step 5: What-If Predictions Table
CREATE TABLE IF NOT EXISTS what_if_predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    current_prediction FLOAT NOT NULL,
    what_if_prediction FLOAT NOT NULL,
    predicted_change FLOAT NOT NULL,
    current_features JSON NOT NULL,
    what_if_features JSON NOT NULL,
    changed_features JSON NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    INDEX ix_what_if_predictions_id (id),
    INDEX ix_what_if_predictions_user_id (user_id),
    INDEX ix_what_if_predictions_created_at (created_at),
    CONSTRAINT fk_what_if_predictions_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
