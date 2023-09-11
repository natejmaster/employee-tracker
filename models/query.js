//dbConnection import
const connection = require('../dbConnection');
// Function to execute a SQL query
function executeQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// Export the executeQuery function for use in other files
module.exports = { executeQuery };