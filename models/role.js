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
    return new Promise((resolve, reject) => {
        // Fetch the list of available departments
        connection.query('SELECT id, department_name FROM departments', (err, results) => {
            if (err) {
                console.error('Error fetching departments', err);
                reject(err);
                return;
            }

            const departments = results.map((department) => ({
                name: department.department_name,
                value: department.id,
            }));

            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'title',
                        message: "Enter the role's title:",
                    },
                    {
                        type: 'number',
                        name: 'salary',
                        message: "Enter the role's salary:",
                    },
                    {
                        type: 'list',
                        name: 'department_id',
                        message: "Select the department for this role:",
                        choices: departments,
                    },
                ])
                .then((answers) => {
                    const { title, salary, department_id } = answers;

                    // Insert the new role into the database
                    const query = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
                    const values = [title, salary, department_id];

                    connection.query(query, values, (err, result) => {
                        if (err) {
                            console.error('Error adding role', err);
                            return;
                        }

                        console.log(`Added new role: ${title}`);
                        viewRoles().then(() => {
                            resolve();
                        })
                        .catch((error) => {
                            reject(error);
                        });
                    });
                });
        });
    });
}

module.exports = { viewRoles, addRole };