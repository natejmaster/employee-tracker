const connection = require('../dbConnection');
const { table } = require('table'); // You can use a table formatting library if desired

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

module.exports = { viewDepartments };