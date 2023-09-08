const departments = require ('express').Router();
const {
    viewDepartments,
    addDepartment,
    deleteDepartment,
} = require('./routes');
//GET route for retrieving department information
departments.get('/', (req, res) => {

});