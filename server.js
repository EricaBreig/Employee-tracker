const inquirer = require("inquirer");

inquirer
  .prompt([
    {
      name: "defaultChoices",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Employees",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "View all roles",
        "Add Role",
        "Remove role",
        "View All Departments",
        "Add Department",
        "Remove Department",
        "~Exit~",
      ],
    },
  ])
  .then((answers) => {
    const {choices} = answers;

      if (choices === 'View All Employees') {
          viewAllEmployees();
      }

      if (choices === 'View All Departments') {
        viewAllDepartments();
    }

      if (choices === 'View All Employees By Department') {
          viewEmployeesByDepartment();
      }

      if (choices === 'Add Employee') {
          addEmployee();
      }

      if (choices === 'Remove Employee') {
          removeEmployee();
      }

      if (choices === 'Update Employee Role') {
          updateEmployeeRole();
      }

      if (choices === 'Update Employee Manager') {
          updateEmployeeManager();
      }

      if (choices === 'View All Roles') {
          viewAllRoles();
      }

      if (choices === 'Add Role') {
          addRole();
      }

      if (choices === 'Remove Role') {
          removeRole();
      }

      if (choices === 'Add Department') {
          addDepartment();
      }

      if (choices === 'View Department Budgets') {
          viewDepartmentBudget();
      }

      if (choices === 'Remove Department') {
          removeDepartment();
      }

      if (choices === 'Exit') {
          connection.end();
      }
});

//-------------------View Employees-------------------


//-------------------Add an Employee-------------------
// insert function
inquirer
.prompt([
    {
        name: "firstName",
        type: "input",
        message: "What is the employee's first name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the employee's last name?",
      },
])
//insert function
inquirer
.prompt([
    {
        name: "department",
        type: "input",
        message: "What is the employee's department?",
      },
      {
        name: "role",
        type: "input",
        message: "What is the employee's role?",
      },
])

//-------------------Remove an Employee-------------------



//-------------------Update Employee Role-------------------
inquirer.prompt([
    {
      type: 'list',
      name: 'employeeName',
      message: "Which employee would you like to update?",
      choices: employees
    }
  ])
//-------------------View all roles-------------------

//-------------------Add Role-------------------
inquirer.prompt([
    {
      type: 'input',
      name: 'role',
      message: "What is the name of the role?",
    },
    {
        type: 'input',
        name: 'department',
        message: "What department is the role in?",
      }
  ])
  .then((response) =>
  response.confirm === response.role
    ? console.log('The role has been added.')
    : console.log('This role already exists.')
);

//-------------------Remove Role-------------------


//-------------------View All Departments-------------------

//---------------Add Department-------------------
//What is the name of the department?
inquirer.prompt([
    {
      type: 'input',
      name: 'department',
      message: "What is the name of the department?",
    }
  ])
  .then((response) =>
  response.confirm === response.department
    ? console.log('The department has been added.')
    : console.log('This department already exists.')
);

//---------------Remove Department-------------------