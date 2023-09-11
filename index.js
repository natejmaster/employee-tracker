const inquirer = require('inquirer');
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
                        addDepartment();
                        break;
                    case 'Add a role':
                        addRole();
                        break;
                    case 'Add an employee':
                        addEmployee();
                        break;
                    case 'Update an employee role':
                        updateEmployeeRole();
                        break;
                    case 'Exit':
                        console.log('Goodbye and thanks for using Employee Tracker! Have a nice day!');
                        process.exit(0);
                }
            });
    }

    displayMenu();
}

// Initialize the main menu function to start the application
mainMenu();