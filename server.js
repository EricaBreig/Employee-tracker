const inquirer = require("inquirer");
// Import and require mysql2
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "root",
    database: "emptracker_db",
  },
  console.log(`Connected to the emptracker_db database.`)
);
connection.connect((err) => {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

// Default Prompt
const promptUser = () => {
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
        connection.end();
      }
    });
};

//-------------------View Employees-------------------

//-------------------Add an Employee-------------------
const addEmployee = () => {
inquirer.prompt([
  {
    name: "first_name",
    type: "input",
    message: "What is the employee's first name?",
  },
  {
    name: "last_name",
    type: "input",
    message: "What is the employee's last name?",
  },
]);
//function to add an employee's name
app.post("/api/new-employee", ({ body }, res) => {
  let sql = `INSERT INTO employee (first_name, last_name)
      VALUES (?)`;
  let params = [body.first_name.last_name];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "The employee has been added",
      data: body,
    });
  });
});
//function to add employee's department and role
inquirer.prompt([
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
]);
};
//-------------------Remove an Employee-------------------

//-------------------Update Employee Role-------------------
const updateEmployeeRole = () => {
inquirer.prompt([
  {
    type: "list",
    name: "employeeName",
    message: "Which employee would you like to update?",
    choices: employees,
  },
]);
};
//-------------------View all roles-------------------

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




};


//-------------------View All Departments-------------------
const viewAllDepartments = () => {

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


};