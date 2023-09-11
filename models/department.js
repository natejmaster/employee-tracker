//Requirements and imports
const inquirer = require('inquirer');
const connection = require('../dbConnection');
const { table } = require('table');
// Function to view all departments
function viewDepartments() {
    return new Promise((resolve, reject) => {
        //Creates query call to select all from departments and display departments table
        const query = 'SELECT * FROM departments';
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching departments', err);
                reject(err);
                return;
            }
            //Data is declared as department id and department name
            const data = [['Department ID', 'Department Name']];
            //Data is pushed into an output variable
            results.forEach((department) => {
                data.push([department.id, department.department_name]);
            });
            //Output variable displays data as a table and logs to the console before resolving and returning to the main menu (main menu call in index.js page)
            const output = table(data);
            console.log('\nAll Departments:');
            console.log(output);
            resolve(); 
        });
    });
}
//Function to add a department
function addDepartment() {
    return new Promise((resolve, reject) => {
        //Questions asked by inquirer once add department selection is made
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
            //Once inquirer is answered, answers are returned with new department name
            .then((answers) => {
                const queryCheck = 'SELECT * FROM departments WHERE department_name = ?';
                const checkValues = [answers.department_name];
                //Error catches, first for internal error checking for department
                connection.query(queryCheck, checkValues, (err, results) => {
                    if (err) {
                        console.error('Error checking for existing department', err);
                        reject(err);
                        return;
                    }
                    //Then error if department added already exists
                    if (results.length > 0) {
                        console.log(`\nThe department '${answers.department_name}' already exists.`);
                        resolve();
                        return;
                    }
                    //Declarations made if department is not already in database
                    const queryInsert = 'INSERT INTO departments (department_name) VALUES (?)';
                    const insertValues = [answers.department_name];
                    //Catch if there's an error in adding this new department to the database
                    connection.query(queryInsert, insertValues, (err, result) => {
                        if (err) {
                            console.error('Error adding department', err);
                            reject(err); 
                            return;
                        }
                        //Success message showing that the new department has been added successfully. Once added, promise is resolved and user returns to main menu
                        console.log(`\n${answers.department_name} department has been added successfully.`);
                        viewDepartments().then(() => {
                            resolve();
                        });
                    });
                });
            });
    });
}
//Exports for both functions to index.js
module.exports = { viewDepartments, addDepartment };
