const users = require('./users/users.service.js');
const employee = require('./employee/employee.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(employee);
};
