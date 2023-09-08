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
    const menuStack = [];

    function displayMenu(choices) {
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: 'Which action would you like to perform?',
                    choices: [...choices, 'Go Back'],
                },
            ])
            .then((answers) => {
                if (answers.action === 'Go Back') {
                    const previousMenu = menuStack.pop();
                    if (previousMenu) {
                        displayMenu(previousMenu);
                    } else {
                        console.log('You are at the main menu.');
                        displayMenu(choices);
                    }
                } else {
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
                    menuStack.push(choices);
                    displayMenu(choices);
                }
            });
    }

    displayMenu([
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
    ]);
}
//Initialize main menu function to start the application
mainMenu();