//Requirements and imports
const inquirer = require('inquirer');
const connection = require('../dbConnection');
const { table } = require('table');
// Function to view all employees
function viewEmployees() {
    return new Promise((resolve, reject) => {
        //Query constructor that shows builds display table including imported values rather than simply the id #s of imported values
        const query = `
            SELECT
                e.id AS 'Employee ID',
                e.first_name AS 'First Name',
                e.last_name AS 'Last Name',
                r.title AS 'Role',
                CONCAT(m.first_name, ' ', m.last_name) AS 'Manager'
            FROM employees AS e
            LEFT JOIN roles AS r ON e.role_id = r.id
            LEFT JOIN employees AS m ON e.manager_id = m.id`;
        //Error message if query fails
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching employees', err);
                return;
            }
            //Constructor of how data is transferred/displayed
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
            //All data is transferred into a table under the output variable and logged to the console.
            const output = table(data);
            console.log('\nAll Employees:');
            console.log(output);
            resolve();
        });
    });
}
//Function to add an employee to employee tables
function addEmployee() {
    return new Promise((resolve, reject) => {
        // Fetch the list of available roles and employees for manager selection
        connection.query('SELECT title FROM roles', (err, roleResults) => {
            if (err) {
                console.error('Error fetching roles', err);
                return;
            }
            //Pulls manager name from first and last name based on employee table
            connection.query('SELECT CONCAT(first_name, " ", last_name) AS manager_name FROM employees', (err, managerResults) => {
                if (err) {
                    console.error('Error fetching managers', err);
                    return;
                }
                //Map method with roles and managers variables updates CLI lists to include ALL roles and managers after each update
                const roles = roleResults.map((role) => role.title);
                const managers = managerResults.map((manager) => manager.manager_name);
                //Inquirer prompt for add employee function
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
                            type: 'list',
                            name: 'role_name',
                            message: "Select the employee's role:",
                            choices: roles,
                        },
                        {
                            type: 'list',
                            name: 'manager_name',
                            message: "Select the employee's manager (optional, press Enter if none):",
                            choices: [...managers, 'None'],
                        },
                    ])
                    //Answers are used to connect to foreign tables
                    .then((answers) => {
                        const { first_name, last_name, role_name, manager_name } = answers;
                        // Find the role ID based on the role name
                        connection.query('SELECT id FROM roles WHERE title = ?', [role_name], (err, roleResults) => {
                            if (err) {
                                console.error('Error finding role', err);
                                return;
                            }
                            // Use the first role ID found (assuming role names are unique)
                            const role_id = roleResults[0] ? roleResults[0].id : null;
                            // Find the manager ID based on the manager name
                            if (manager_name !== 'None') {
                                const [managerFirstName, managerLastName] = manager_name.split(' ');
                                connection.query(
                                    'SELECT id FROM employees WHERE first_name = ? AND last_name = ?',
                                    [managerFirstName, managerLastName],
                                    (err, managerResults) => {
                                        if (err) {
                                            console.error('Error finding manager', err);
                                            return;
                                        }
                                        // Use the first manager ID found (assuming manager names are unique)
                                        const manager_id = managerResults[0] ? managerResults[0].id : null;
                                        // Insert the employee into the database
                                        const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
                                        const values = [first_name, last_name, role_id, manager_id];
                                        //Error message for adding employee
                                        connection.query(query, values, (err, result) => {
                                            if (err) {
                                                console.error('Error adding employee', err);
                                                return;
                                            }
                                            //Success message upon completion of adding employee to employee table
                                            console.log(`Added employee: ${answers.first_name} ${answers.last_name}`);
                                            viewEmployees().then(() => {
                                                resolve();
                                            });
                                        });
                                    });
                            } else {
                                // Insert the employee into the database without a manager
                                const query = 'INSERT INTO employees (first_name, last_name, role_id) VALUES (?, ?, ?)';
                                const values = [first_name, last_name, role_id];
                                //Throws error if value cannot be added to database
                                connection.query(query, values, (err, result) => {
                                    if (err) {
                                        console.error('Error adding employee', err);
                                        return;
                                    }
                                    //Success message if employee is successfully added with null manager value
                                    console.log(`Added employee: ${answers.first_name} ${answers.last_name}`);
                                    viewEmployees().then(() => {
                                        resolve();
                                    });
                                });
                            }
                        });
                    });
            });
        });
    });
}
// Function to update an employee's role
function updateEmployeeRole() {
    return new Promise((resolve, reject) => {
        // Fetch the list of available employees and roles
        connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS employee_name FROM employees', (err, employeeResults) => {
            if (err) {
                console.error('Error fetching employees', err);
                return;
            }
            //Fetches id and title value from roles table
            connection.query('SELECT id, title FROM roles', (err, roleResults) => {
                if (err) {
                    console.error('Error fetching roles', err);
                    return;
                }
                //Declare employees variable in order to use in list for inquirer prompt
                const employees = employeeResults.map((employee) => ({
                    name: employee.employee_name,
                    value: employee.id,
                }));
                //Declare roles variable in order to use in list for inquirer prompt
                const roles = roleResults.map((role) => ({
                    name: role.title,
                    value: role.id,
                }));
                //Inquirer prompt for updating employee role
                inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'employee_id',
                            message: "Select the employee you want to update:",
                            choices: employees,
                        },
                        {
                            type: 'list',
                            name: 'new_role_id',
                            message: "Select the new role for the employee:",
                            choices: roles,
                        },
                    ])
                    .then((answers) => {
                        const { employee_id, new_role_id } = answers;
                        // Update the employee's role in the database
                        const query = 'UPDATE employees SET role_id = ? WHERE id = ?';
                        const values = [new_role_id, employee_id];
                        //Throw error for failure to update employee role
                        connection.query(query, values, (err, result) => {
                            if (err) {
                                console.error('Error updating employee role', err);
                                return;
                            }
                            //If no employee is found to match the selected employee
                            if (result.affectedRows === 0) {
                                console.log('No employee found with the provided ID.');
                            } else {
                                //Success message for completion of employee update
                                console.log(`Updated employee's role (Employee ID: ${employee_id}).`);
                                viewEmployees().then(() => {
                                    resolve();
                                });
                            }
                        });
                    });
            });
        });
    });
}
//Export employee functions
module.exports = { viewEmployees, addEmployee, updateEmployeeRole };
