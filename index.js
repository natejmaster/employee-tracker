//Require inquirer
const inquirer = require('inquirer');
//Import functions for department, role, and employee handling
const {
    viewDepartments,
    addDepartment,
} = require('./models/department');
const {
    viewRoles,
    addRole,
} = require('./models/role');
const {
    viewEmployees,
    addEmployee,
    updateEmployeeRole,
} = require('./models/employee');
//Main menu function with displayMenu inquirer function to present main menu
function mainMenu() {
    function displayMenu() {
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
            //Switch calls imported function depending on main menu selection. After each function is called to completion, menu is displayed again
            .then((answers) => {
                switch (answers.action) {
                    case 'View all departments':
                        viewDepartments().then(() => {
                            displayMenu();
                        });
                        break;
                    case 'View all roles':
                        viewRoles().then(() => {
                            displayMenu();
                        });
                        break;
                    case 'View all employees':
                        viewEmployees().then(() => {
                            displayMenu();
                        });
                        break;
                    case 'Add a department':
                        addDepartment().then(() => {
                            displayMenu();
                        });
                        break;
                    case 'Add a role':
                        addRole().then(() => {
                            displayMenu();
                        });
                        break;
                    case 'Add an employee':
                        addEmployee().then(() => {
                            displayMenu();
                        });
                        break;
                    case 'Update an employee role':
                        updateEmployeeRole().then(() => {
                            displayMenu();
                        });
                        break;
                    case 'Exit':
                        console.log('Goodbye and thanks for using Employee Tracker! Have a nice day!');
                        process.exit(0);
                }
            });
    }
    //Calls displayMenu function to initialize main menu
    displayMenu();
}

// Initialize the main menu function to start the application
mainMenu();