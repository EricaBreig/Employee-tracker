const inquirer = require("inquirer");
// Import and require mysql2
const mysql = require("mysql2");
//Import and require Console Table
const cTable = require('console.table');

// Connect to database
const dbConnection = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "root",
    database: "emptracker_db",
  },
  console.log(`Connected to the emptracker_db database.`)
);

dbConnection.query((err) => {
  if (err) throw err;
  console.log("connected as id " + dbConnection.threadId);
  afterConnection();
});

afterConnection = () => {
  console.log("***********************************")
  console.log("*                                 *")
  console.log("*        EMPLOYEE MANAGER         *")
  console.log("*                                 *")
  console.log("***********************************")
  promptUser();
};


// Default Prompt
const promptUser = () => {
  inquirer
    .prompt([
      {
        name: "choices",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View Employees",
          "Add Employee",
          "Remove Employee",
          "Update Employee Role",
          "Update Emplpyee Manager",
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
      const { choices } = answers;

      if (choices === "View All Employees") {
        viewAllEmployees();
      }

      if (choices === "View All Departments") {
        viewAllDepartments();
      }

      if (choices === "View All Employees By Department") {
        viewEmployeesByDepartment();
      }

      if (choices === "Add Employee") {
        addEmployee();
      }

      if (choices === "Remove Employee") {
        removeEmployee();
      }

      if (choices === "Update Employee Role") {
        updateEmployeeRole();
      }

      if (choices === "Update Employee Manager") {
        updateEmployeeManager();
      }

      if (choices === "View All Roles") {
        viewAllRoles();
      }

      if (choices === "Add Role") {
        addRole();
      }

      if (choices === "Remove Role") {
        removeRole();
      }

      if (choices === "Add Department") {
        addDepartment();
      }

      if (choices === "Remove Department") {
        removeDepartment();
      }

      if (choices === "Exit") {
        dbConnection.end();
      }
    });
};
promptUser();
//-------------------View all Employees-------------------
const viewAllEmployees = () => {
let query = 'SELECT * FROM employee';
dbConnection.query(query, (err, res) => {
    if (err) throw err;
    console.log(res.length + ' employees found!');
    console.table('All Employees:', res); 
    options();
})};

//-------------------Add an Employee-------------------
const addEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'fistName',
      message: "What is the employee's first name?",
      validate: addFirstName => {
        if (addFirstName) {
            return true;
        } else {
            console.log('Please enter a first name');
            return false;
        }
      }
    },
    {
      type: 'input',
      name: 'lastName',
      message: "What is the employee's last name?",
      validate: addLastName => {
        if (addLastName) {
            return true;
        } else {
            console.log('Please enter a last name');
            return false;
        }
      }
    }
  ])
    .then(answer => {
    const userInput = [answer.fistName, answer.lastName]
    const roleSql = `SELECT role.id, role.title FROM role`;
    dbConnection.promise().query(roleSql, (error, data) => {
      if (error) throw error; 
      const roles = data.map(({ id, title }) => ({ name: title, value: id }));
      inquirer.prompt([
            {
              type: 'list',
              name: 'role',
              message: "What is the employee's role?",
              choices: roles
            }
          ])
            .then(roleChoice => {
              const role = roleChoice.role;
              userInput.push(role);
              const managerSql =  `SELECT * FROM employee`;
              dbConnection.promise().query(managerSql, (error, data) => {
                if (error) throw error;
                const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: managers
                  }
                ])
                  .then(managerChoice => {
                    const manager = managerChoice.manager;
                    userInput.push(manager);
                    const sql =   `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                  VALUES (?, ?, ?, ?)`;
                    dbConnection.query(sql, userInput, (error) => {
                    if (error) throw error;
                    console.log("Employee has been added!")
                    viewAllEmployees();
              });
            });
          });
        });
     });
  });
  
// inquirer.prompt([
//   {
//     name: "first_name",
//     type: "input",
//     message: "What is the employee's first name?",
//   },
//   {
//     name: "last_name",
//     type: "input",
//     message: "What is the employee's last name?",
//   },
//   {
//         name: "department",
//         type: "input",
//         message: "What is the employee's department?",
//       },
//       {
//         name: "role",
//         type: "input",
//         message: "What is the employee's role?",
//       },
// ])
// .then((answers) =>{
// console.log(answers)
// })
// .catch((error) => {
//     console.log(error)
// })

};
//-------------------Remove an Employee-------------------
const removeEmployee = () => {

  // get employees from employee table 
  const employeeSql = `SELECT * FROM employee`;

  dbConnection.promise().query(employeeSql, (err, data) => {
    if (err) throw err; 

  const employeeNames = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Which employee would you like to delete?",
        choices: employeeNames
      }
    ])
      .then(empChoice => {
        const employee = empChoice.name;

        const sql = `DELETE FROM employee WHERE id = ?`;

        dbConnection.query(sql, employee, (err, result) => {
          if (err) throw err;
          console.log("Successfully Deleted!");
        
          viewAllEmployees();
    });
  });
 });
}


//-------------------Update Employee Role-------------------
const updateEmployeeRole = () => {
  let sql =       `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id"
                    FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
    dbConnection.promise().query(sql, (error, response) => {
      if (error) throw error;
      let employeeNames = [];
      response.forEach((employee) => {employeeNames.push(`${employee.first_name} ${employee.last_name}`);});

      let sql =     `SELECT role.id, role.title FROM role`;
    dbConnection.promise().query(sql, (error, response) => {
        if (error) throw error;
        let rolesArray = [];
        response.forEach((role) => {rolesArray.push(role.title);});

        inquirer
          .prompt([
            {
              name: 'chosenEmployee',
              type: 'list',
              message: 'Which employee has a new role?',
              choices: employeeNames
            },
            {
              name: 'chosenRole',
              type: 'list',
              message: 'What is their new role?',
              choices: rolesArray
            }
          ])
          .then((answer) => {
            let newTitleId, employeeId;

            response.forEach((role) => {
              if (answer.chosenRole === role.title) {
                newTitleId = role.id;
              }
            });

            response.forEach((employee) => {
              if (
                answer.chosenEmployee ===
                `${employee.first_name} ${employee.last_name}`
              ) {
                employeeId = employee.id;
              }
            });

            let sqls =    `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
            dbConnection.query(
              sqls,
              [newTitleId, employeeId],
              (error) => {
                if (error) throw error;
                console.log(chalk.greenBright.bold(`====================================================================================`));
                console.log(chalk.greenBright(`Employee Role Updated`));
                console.log(chalk.greenBright.bold(`====================================================================================`));
                promptUser();
              }
            );
          });
      });
    });
};
// -------------------Update a manager-------------------
const updateEmployeeManager = () =>{
  let sql =       `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id
  FROM employee`;
dbConnection.promise().query(sql, (error, response) => {
let employeeNames = [];
response.forEach((employee) => {employeeNames.push(`${employee.first_name} ${employee.last_name}`);});

inquirer
.prompt([
{
name: 'chosenEmployee',
type: 'list',
message: 'Which employee has a new manager?',
choices: employeeNames
},
{
name: 'newManager',
type: 'list',
message: 'Who is their manager?',
choices: employeeNames
}
])
.then((answer) => {
let employeeId, managerId;
response.forEach((employee) => {
if (
answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`
) {
employeeId = employee.id;
}

if (
answer.newManager === `${employee.first_name} ${employee.last_name}`
) {
managerId = employee.id;
}
});

if (validate.isSame(answer.chosenEmployee, answer.newManager)) {
console.log(chalk.redBright.bold(`====================================================================================`));
console.log(chalk.redBright(`Invalid Manager Selection`));
console.log(chalk.redBright.bold(`====================================================================================`));
promptUser();
} else {
let sql = `UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`;

dbConnection.query(
sql,
[managerId, employeeId],
(error) => {
if (error) throw error;
console.log(chalk.greenBright.bold(`====================================================================================`));
console.log(chalk.greenBright(`Employee Manager Updated`));
console.log(chalk.greenBright.bold(`====================================================================================`));
promptUser();
}
);
}
});
});
}

//-------------------View all roles-------------------
const viewAllRoles = () => {
let query = 'SELECT * FROM role';
  dbConnection.query(query, (err, res) => {
        if (err) throw err;
        console.table('All Roles:', res);
        options();
})}

//-------------------Add Role-------------------
const addRole = () => {

inquirer
  .prompt([
    {
      type: "input",
      name: "role",
      message: "What is the name of the role?",
    },
    {
      type: "input",
      name: "department",
      message: "What department is the role in?",
    },
  ])
  .then((response) =>
    response.confirm === response.role
      ? console.log("The role has been added.")
      : console.log("This role already exists.")
  );
};
//-------------------Remove Role-------------------
const removeRole = () => {
  const roleSql = `SELECT * FROM role`; 

  dbConnection.promise().query(roleSql, (err, data) => {
    if (err) throw err; 

    const role = data.map(({ title, id }) => ({ name: title, value: id }));

    inquirer.prompt([
      {
        type: 'list', 
        name: 'role',
        message: "Which role would you like to delete?",
        choices: role
      }
    ])
      .then(roleChoice => {
        const role = roleChoice.role;
        const sql = `DELETE FROM role WHERE id = ?`;

        dbConnection.query(sql, role, (err, result) => {
          if (err) throw err;
          console.log("Successfully deleted!"); 

          showRoles();
      });
    });
  });
};


//-------------------View All Departments-------------------
const viewAllDepartments = () => {
    let query = 'SELECT * FROM department';
    dbConnection.query(query, (err, res) => {
        if(err)throw err;
        console.table('All Departments:', res);
        options();
    })

};
//---------------Add Department-------------------
const addDepartment = () => {

//What is the name of the department?
inquirer
  .prompt([
    {
      type: "input",
      name: "department",
      message: "What is the name of the department?",
    },
  ])
  .then((response) =>
    response.confirm === response.department
      ? console.log("The department has been added.")
      : console.log("This department already exists.")
  );
};

//---------------Remove Department-------------------
const removeDepartment = () => {
  let query = `SELECT * FROM department`; 
  dbConnection.promise().query(query, (err, data) => {
    if (err) throw err; 

    const dept = data.map(({ dep_name, id }) => ({ name: dep_name, value: id }));

    inquirer.prompt([
      {
        type: 'list', 
        name: 'dept',
        message: "What department would you like to delete?",
        choices: dept
      }
    ])
      .then(deptChoice => {
        const dept = deptChoice.dept;
        const sql = `DELETE FROM department WHERE id = ?`;

        dbConnection.query(sql, dept, (err, result) => {
          if (err) throw err;
          console.log("Successfully deleted!"); 

          viewAllDepartments();
      });
    });
  });

};

//-----------------View all Employees by department -----------
const viewEmployeesByDepartment = () => {
  console.log('Showing employee by departments...\n');
  const sql = `SELECT employee.first_name, 
                      employee.last_name, 
                      department.name AS department
               FROM employee 
               LEFT JOIN role ON employee.role_id = role.id 
               LEFT JOIN department ON role.department_id = department.id`;

  dbConnection.promise().query(sql, (err, rows) => {
    if (err) throw err; 
    console.table(rows); 
    promptUser();
  }); 
};