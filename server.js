const inquirer = require("inquirer");
// Import and require mysql2
const mysql = require("mysql2");
//Import and require Console Table
const cTable = require("console.table");

const afterConnection = () => {
  console.log("***********************************");
  console.log("*                                 *");
  console.log("*        EMPLOYEE MANAGER :3      *");
  console.log("*                                 *");
  console.log("***********************************");
};

// Connect to database
const dbConnection = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "root",
    database: "emptracker_db",
  },
  afterConnection()
);

const mainMenu = () => {
  inquirer
    .prompt([
      {
        name: "choices",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View all Employees",
          "View all Employees by Department",
          "Add Employee",
          "Remove Employee",
          "Update Employee Manager",
          "View all Roles",
          "Add Role",
          "View all Departments",
          "Add Department",
          "Remove Department",
          "~Exit~",
        ],
      },
    ])
    .then((answers) => {
      const { choices } = answers;
      if (choices === "View all Employees") {
        viewAllEmployees();
      }

      if (choices === "View all Departments") {
        viewAllDepartments();
      }

      if (choices === "View all Employees by Department") {
        viewEmployeesByDepartment();
      }

      if (choices === "Add Employee") {
        addEmployee();
      }

      if (choices === "Remove Employee") {
        removeEmployee();
      }

      // if (choices === "Update Employee Role") {
      //   updateEmployeeRole();
      // }

      if (choices === "Update Employee Manager") {
        updateEmployeeManager();
      }

      if (choices === "View all Roles") {
        viewAllRoles();
      }

      if (choices === "Add Role") {
        addRole();
      }

      // if (choices === "Remove Role") {
      //   removeRole();
      // }

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
mainMenu();

//-------------------View all Employees-------------------
const viewAllEmployees = () => {
  let query = "SELECT * FROM employee";
  dbConnection
    .promise()
    .query(query)
    .then(([res]) => {
      console.log(res.length + " employees found!");
      console.table("All Employees:", res);
      mainMenu();
    });
};

//-------------------Add an Employee-------------------
const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "fistName",
        message: "What is the employee's first name?",
        validate: (addFirstName) => {
          if (addFirstName) {
            return true;
          } else {
            console.log("Please enter a first name");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
        validate: (addLastName) => {
          if (addLastName) {
            return true;
          } else {
            console.log("Please enter a last name");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const userInput = [answer.fistName, answer.lastName];
      const roleSql = `SELECT role.id, role.title FROM role`;
      dbConnection
        .promise()
        .query(roleSql)
        .then(([data]) => {
          console.log(data);
          const roles = data.map(({ id, title }) => ({
            name: title,
            value: id,
          }));
          inquirer
            .prompt([
              {
                type: "list",
                name: "role",
                message: "What is the employee's role?",
                choices: roles,
              },
            ])
            .then((roleChoice) => {
              const role = roleChoice.role;
              userInput.push(role);
              const managerSql = `SELECT * FROM employee`;
              dbConnection
                .promise()
                .query(managerSql)
                .then(([data]) => {
                  const managers = data.map(
                    ({ id, first_name, last_name }) => ({
                      name: first_name + " " + last_name,
                      value: id,
                    })
                  );
                  inquirer
                    .prompt([
                      {
                        type: "list",
                        name: "manager",
                        message: "Who is the employee's manager?",
                        choices: managers,
                      },
                    ])
                    .then((managerChoice) => {
                      const manager = managerChoice.manager;
                      userInput.push(manager);
                      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES (?, ?, ?, ?)`;
                      dbConnection.query(sql, userInput, (error) => {
                        if (error) throw error;
                        console.log("Employee has been added!");
                        viewAllEmployees();
                      });
                    });
                });
            });
        });
      mainMenu();
    });
};

//-------------------Remove an Employee-------------------
const removeEmployee = () => {
  // get employees from employee table
  const employeeSql = `SELECT * FROM employee`;

  dbConnection
    .promise()
    .query(employeeSql)
    .then(([data]) => {
      const employeeNames = data.map(({ id, first_name, last_name }) => ({
        name: first_name + " " + last_name,
        value: id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "name",
            message: "Which employee would you like to delete?",
            choices: employeeNames,
          },
        ])
        .then((empChoice) => {
          const employee = empChoice.name;

          const sql = `DELETE FROM employee WHERE id = ?`;

          dbConnection.query(sql, employee, (err, result) => {
            if (err) throw err;
            console.log("Successfully Deleted!");

            viewAllEmployees();
          });
        });
    });
  mainMenu();
};

//-------------------Update Employee Role-------------------
// const updateEmployeeRole = () => {
//   let sql = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id"
//                     FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
//   dbConnection
//     .promise()
//     .query(sql)
//     .then(([data]) => {
//       let employeeNames = [];
//       response.forEach((employee) => {
//         employeeNames.push(`${employee.first_name} ${employee.last_name}`);
//       });

//       let sql = `SELECT role.id, role.title FROM role`;
//       dbConnection.promise().query(sql, (error, response) => {
//         if (error) throw error;
//         let rolesArray = [];
//         response.forEach((role) => {
//           rolesArray.push(role.title);
//         });

//         inquirer
//           .prompt([
//             {
//               name: "chosenEmployee",
//               type: "list",
//               message: "Which employee has a new role?",
//               choices: employeeNames,
//             },
//             {
//               name: "chosenRole",
//               type: "list",
//               message: "What is their new role?",
//               choices: rolesArray,
//             },
//           ])
//           .then((answer) => {
//             let newTitleId, employeeId;

//             response.forEach((role) => {
//               if (answer.chosenRole === role.title) {
//                 newTitleId = role.id;
//               }
//             });

//             response.forEach((employee) => {
//               if (
//                 answer.chosenEmployee ===
//                 `${employee.first_name} ${employee.last_name}`
//               ) {
//                 employeeId = employee.id;
//               }
//             });

//             let sqls = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
//             dbConnection.query(sqls, [newTitleId, employeeId], (error) => {
//               if (error) throw error;
//               console.log(`Employee Role Updated`);
//               mainMenu();
//             });
//           });
//       });
//     });
// };
// -------------------Update Employee manager-------------------
const updateEmployeeManager = () => {
  let sql = `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id
  FROM employee`;
  dbConnection.query(sql, (error, response) => {
    let employeeNames = [];
    response.forEach((employee) => {
      employeeNames.push(`${employee.first_name} ${employee.last_name}`);
    });

    inquirer
      .prompt([
        {
          name: "chosenEmployee",
          type: "list",
          message: "Which employee has a new manager?",
          choices: employeeNames,
        },
        {
          name: "newManager",
          type: "list",
          message: "Who is their manager?",
          choices: employeeNames,
        },
      ])
      .then((answer) => {
        let employeeId, managerId;
        response.forEach((employee) => {
          if (
            answer.chosenEmployee ===
            `${employee.first_name} ${employee.last_name}`
          ) {
            employeeId = employee.id;
          }

          if (
            answer.newManager === `${employee.first_name} ${employee.last_name}`
          ) {
            managerId = employee.id;
          }
        });

        if (answer.chosenEmployee === answer.newManager) {
          console.log(`Invalid Manager Selection`);
          mainMenu();
        } else {
          let sql = `UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`;

          dbConnection.query(sql, [managerId, employeeId], (error) => {
            if (error) throw error;
            console.log(`Employee Manager Updated`);
            mainMenu();
          });
        }
      });
  });
};

//-------------------View all roles-------------------

const viewAllRoles = () => {
  let query = "SELECT * FROM role";
  dbConnection
    .promise()
    .query(query)
    .then(([res]) => {
      console.table("All Roles:", res);
      mainMenu();
    });
};

//-------------------Add Role-------------------
const addRole = () => {
  let departmentOptions;
  dbConnection
    .promise()
    .query("SELECT id, dep_name FROM department")
    .then(([results]) => {
      console.log(results);
      departmentOptions = results.map((a) => {
        return {
          name: a.name,
          value: a.id,
        };
      });
    })
    .then(() => {
      inquirer
        .prompt([
          {
            type: "input",
            name: "addRole",
            message: "What is the name of the new role?",
          },
          {
            type: "input",
            name: "newSalary",
            message: "What is the salary of the new role?",
          },
          {
            type: "list",
            name: "whichDepartment",
            message: "In which department is the new role?",
            choices: departmentOptions,
          },
        ])
        .then((answer) => {
          dbConnection.query(
            "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);",
            [answer.addRole, answer.newSalary, answer.whichDepartment]
          );

          mainMenu();
        });
    });
};

//-------------------Remove Role-------------------
const removeRole = () => {
  const roleSql = `SELECT * FROM role`;
  dbConnection
    .promise()
    .query(roleSql)
    .then(([data]) => {
      let role = data.map(({ title, id }) => ({ name: title, value: id }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "role",
            message: "Which role would you like to delete?",
            choices: role,
          },
        ])
        .then((roleChoice) => {
          let role = roleChoice.role;
          let sql = `DELETE FROM role WHERE id = ?`;

          dbConnection.query((sql, role) => {
            console.log("Successfully deleted!");
            viewAllRoles();
          });
        });
    });
};

//-------------------View All Departments-------------------
const viewAllDepartments = () => {
  let query = "SELECT * FROM department";
  dbConnection.query(query, (err, res) => {
    if (err) throw err;
    console.table("All Departments:", res);
    mainMenu();
  });
};

//---------------Add Department-------------------
const addDepartment = () => {
  inquirer
    .prompt({
      type: "input",
      name: "addDepartment",
      message: "What is the name of the new department?",
    })
    .then((answer) => {
      dbConnection.query(
        "INSERT INTO department (dep_name) VALUES (?);",
        answer.addDepartment
      );
      viewAllDepartments();
    });
};


//---------------Remove Department-------------------
const removeDepartment = () => {
  let query = `SELECT * FROM department`;
  dbConnection
    .promise()
    .query(query)
    .then(([data]) => {
      const dept = data.map(({ dep_name, id }) => ({
        name: dep_name,
        value: id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "dept",
            message: "What department would you like to delete?",
            choices: dept,
          },
        ])
        .then((deptChoice) => {
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
  console.log("Showing employee by departments...\n");
  let sql = `SELECT employee.first_name, 
                      employee.last_name, 
                      department.dep_name AS department
               FROM employee 
               LEFT JOIN role ON employee.role_id = role.id 
               LEFT JOIN department ON role.department_id = department.id`;

  dbConnection
    .promise()
    .query(sql)
    .then(([rows]) => {
      console.table(rows);
      mainMenu();
    });
};
