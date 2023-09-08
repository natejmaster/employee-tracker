-- Seed data for the departments table
INSERT INTO departments (department_name) VALUES
    ('Sales'),
    ('Marketing'),
    ('Finance'),
    ('HR'),
    ('Engineering');

-- Seed data for the roles table
INSERT INTO roles (title, salary, department_id) VALUES
    ('Sales Manager', 80000, 1),
    ('Sales Representative', 50000, 1),
    ('Marketing Manager', 75000, 2),
    ('Marketing Specialist', 55000, 2),
    ('Financial Analyst', 70000, 3),
    ('HR Manager', 72000, 4),
    ('HR Specialist', 55000, 4),
    ('Software Engineer', 90000, 5),
    ('QA Engineer', 80000, 5),
    ('Product Manager', 95000, 5);

-- Seed data for the employees table
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
    ('John', 'Doe', 1, NULL),  -- Sales Manager
    ('Jane', 'Smith', 2, 1),    -- Sales Representative (Reports to Sales Manager)
    ('Michael', 'Johnson', 3, NULL),  -- Marketing Manager
    ('Emily', 'Davis', 4, 3),    -- Marketing Specialist (Reports to Marketing Manager)
    ('David', 'Wilson', 5, NULL),  -- Financial Analyst
    ('Sarah', 'Brown', 6, NULL),  -- HR Manager
    ('Rachel', 'Lee', 7, 6),    -- HR Specialist (Reports to HR Manager)
    ('Robert', 'Anderson', 8, NULL),  -- Software Engineer
    ('William', 'Harris', 9, 8),    -- QA Engineer (Reports to Software Engineer)
    ('Elizabeth', 'Clark', 10, 8);  -- Product Manager (Reports to Software Engineer)