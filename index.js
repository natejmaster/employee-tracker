const inquirer = require('inquirer');
const {
  viewDepartments,
  viewRoles,
  viewEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
} = require('./routes'); // Import your route handlers

function mainMenu() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'Which action would you like to perform?',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'Exit',
                ],
            },
        ])
        .then((answers) => {
            switch (answers.action) {
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                case 'Update an employee role':
                    updateEmployeeRole();
                    break;
                case 'Exit':
                    console.log('Goodbye and thanks for using Employee Tracker! Have a nice day!');
                    process.exit(0);
            }
        });
}

//Initialize main menu function to start the application
mainMenu();