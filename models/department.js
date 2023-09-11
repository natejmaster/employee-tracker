const inquirer = require('inquirer');
const connection = require('../dbConnection');
const { table } = require('table');

// Function to view all departments
function viewDepartments() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM departments';

        connection.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching departments', err);
                reject(err); // Reject the promise on error
                return;
            }

            const data = [['Department ID', 'Department Name']];
            results.forEach((department) => {
                data.push([department.id, department.department_name]);
            });
            const output = table(data);
            console.log('\nAll Departments:');
            console.log(output);
            resolve(); // Resolve the promise when the data is displayed
        });
    });
}

function addDepartment() {
    return new Promise((resolve, reject) => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'department_name',
                message: 'Enter the name of the new department:',
                validate: function (value) {
                    if (value.trim() !== '') {
                        return true;
                    }
                    return 'Department name cannot be empty.';
                },
            },
        ])
            .then((answers) => {
                const queryCheck = 'SELECT * FROM departments WHERE department_name = ?';
                const checkValues = [answers.department_name];

                connection.query(queryCheck, checkValues, (err, results) => {
                    if (err) {
                        console.error('Error checking for existing department', err);
                        reject(err);
                        return;
                    }
                    if (results.length > 0) {
                        console.log(`\nThe department '${answers.department_name}' already exists.`);
                        resolve();
                        return;
                    }
                    const queryInsert = 'INSERT INTO departments (department_name) VALUES (?)';
                    const insertValues = [answers.department_name];

                    connection.query(queryInsert, insertValues, (err, result) => {
                        if (err) {
                            console.error('Error adding department', err);
                            reject(err); 
                            return;
                        }
                        console.log(`\n${answers.department_name} department has been added successfully.`);
                        viewDepartments().then(() => {
                            resolve();
                        });
                    });
                });
            });
    });
}

module.exports = { viewDepartments, addDepartment };
