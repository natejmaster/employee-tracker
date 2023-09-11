DROP DATABASE IF EXISTS employeess_db;
CREATE DATABASE employees_db;
--Uses employees_db database for any references to tables within --
USE employees_db;
--Creates departments table with department ID and department name columns--
CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL
);
--Creates roles table with role id, title, salary, and department id values--
CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
    ON DELETE SET NULL
);
--Creates employees table with employee id, first name, last name, role id, and manager id values--
CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id)
    REFERENCES roles(id)
    ON DELETE SET NULL,
    FOREIGN KEY (manager_id)
    REFERENCES employees(id)
    ON DELETE SET NULL
);