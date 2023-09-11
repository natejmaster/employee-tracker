const inquirer = require('inquirer');
const connection = require('../dbConnection');
const { table } = require('table');

// Function to view all roles
function viewRoles() {
    return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM roles';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching roles', err);
            return;
        }

        const data = [['Role ID', 'Title', 'Salary', 'Department ID']];
        results.forEach((role) => {
            data.push([role.id, role.title, role.salary, role.department_id]);
        });

        const output = table(data);
        console.log('\nAll Roles:');
        console.log(output);
        resolve();
    });
});
}

// Function to add a new role
function addRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'title',
                message: "Enter the role's title:",
            },
            {
                type: 'input',
                name: 'salary',
                message: "Enter the role's salary:",
                validate: (input) => {
                    const valid = !isNaN(parseFloat(input)) && isFinite(input);
                    return valid || 'Please enter a valid number for the salary.';
                },
            },
            {
                type: 'input',
                name: 'department_id',
                message: "Enter the department ID for this role:",
            },
        ])
        .then((answers) => {
            const query = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
            const values = [answers.title, answers.salary, answers.department_id];

            connection.query(query, values, (err, result) => {
                if (err) {
                    console.error('Error adding role', err);
                    return;
                }

                console.log(`Added role: ${answers.title}`);
                viewRoles();
            });
        });
}

module.exports = { viewRoles, addRole };