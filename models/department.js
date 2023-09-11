const inquirer = require('inquirer');
const connection = require('../dbConnection');
const { table } = require('table');

//Function to view all departments
function viewDepartments() {
    const query = 'SELECT * FROM departments';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching departments', err);
            return;
        }

        const data = [['Department ID', 'Department Name']];
        results.forEach((department) => {
            data.push([department.id, department.department_name]);
        });
    const output = table(data);
    console.log('\nAll Departments:');
    console.log(output);
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department_name',
            message: 'Enter the name of the new department:',
            validate: function (value) {
                if (value.trim() !=='') {
                    return true;
                }
                return 'Department name cannot be empty.';
            },
        },
    ])
    .then((answers) => {
        const queryCheck = 'SELECT * FROM departments WHERE department_name = ?';
        const checkValues = [answers.department_name];

        connection.query(queryCheck, checkValues, (err,results) => {
            if (err) {
                console.error('Error checking for existing department', err);
                return;
            }
            if (results.length > 0) {
                console.log(`\nThe department '${answers.department_name}' already exists.`);
                return;
            }
            const queryInsert = 'INSERT INTO departments (department_name) VALUES (?)';
            const insertValues = [answers.department_name];

            connection.query(queryInsert, insertValues, (err, result) => {
                if (err) {
                    console.error('Error adding department', err);
                    return;
                }
            console.log(`\n${answers.department_name} department has been added successfully.`);
            viewDepartments();
            });
        });
    });
}

module.exports = { viewDepartments, addDepartment };