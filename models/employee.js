const inquirer = require('inquirer');
const connection = require('../dbConnection');
const { table } = require('table');

//Function to view all departments
function viewEmployees() {
    return new Promise((resolve, reject) => {
    const query = `SELECT
    e.id AS 'Employee ID',
    e.first_name AS 'First Name',
    e.last_name AS 'Last Name',
    r.title AS 'Role',
    CONCAT(m.first_name, ' ', m.last_name) AS 'Manager'
    FROM employees AS e
    LEFT JOIN roles AS r ON e.role_id = r.id
    LEFT JOIN employees AS m ON e.manager_id = m.id`;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching employees', err);
            return;
        }

        const data = [['Employee ID', 'First Name', 'Last Name', 'Role', 'Manager']];
        results.forEach((employee) => {
            data.push([
                employee['Employee ID'],
                employee['First Name'],
                employee['Last Name'],
                employee['Role'],
                employee['Manager']
            ]);
        });
    const output = table(data);
    console.log('\nAll Employees:');
    console.log(output);
    resolve();
    });
});
}

function addEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'first_name',
                message: "Enter the employee's first name:",
            },
            {
                type: 'input',
                name: 'last_name',
                message: "Enter the employee's last name:",
            },
            {
                type: 'input',
                name: 'role_id',
                message: "Enter the employee's role ID:",
            },
            {
                type: 'input',
                name: 'manager_id',
                message: "Enter the employee's manager ID (optional, press Enter if none):",
            },
        ])
        .then((answers) => {
            const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
            const values = [answers.first_name, answers.last_name, answers.role_id, answers.manager_id || null];

            connection.query(query, values, (err, result) => {
                if (err) {
                    console.error('Error adding employee', err);
                    return;
                }

                console.log(`Added employee: ${answers.first_name} ${answers.last_name}`);
                viewEmployees();
            });
        });
}

// Function to update an employee's role
function updateEmployeeRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'employee_id',
                message: "Enter the employee's ID you want to update:",
            },
            {
                type: 'input',
                name: 'new_role_id',
                message: "Enter the new role ID for the employee:",
            },
        ])
        .then((answers) => {
            const query = 'UPDATE employees SET role_id = ? WHERE id = ?';
            const values = [answers.new_role_id, answers.employee_id];

            connection.query(query, values, (err, result) => {
                if (err) {
                    console.error('Error updating employee role', err);
                    return;
                }

                if (result.affectedRows === 0) {
                    console.log('No employee found with the provided ID.');
                } else {
                    console.log(`Updated employee's role (Employee ID: ${answers.employee_id}).`);
                    viewEmployees();
                }
            });
        });
}

module.exports = { viewEmployees, addEmployee, updateEmployeeRole };