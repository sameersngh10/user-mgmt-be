const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());
const port = process.env.PORT || 3000;

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "employeedb",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
});

console.log("connection created successfully", pool);
// employee
app.post("/add-emp", async (req, res) => {
  const { firstname, lastname, dept_id, emp_type } = req.body;
  const [rows, fields] = await pool.query(
    `INSERT INTO employee(firstname,lastname, dept_id,emp_type) VALUES (?,?,?,?)`,
    [firstname, lastname, dept_id, emp_type]
  );

  res.json({
    message: "Employee Added Successfully",
  });
});

app.get("/get-employeebyid", async (req, res) => {
  const { id } = req.query;
  const [rows, fields] = await pool.query(
    `SELECT * from employee WHERE id=(?)`,
    [id]
  );
  res.json(rows[0]);
});

app.post("/update-employee", async (req, res) => {
  const { firstname, lastname, dept_id, emp_type, id } = req.body;
  const [rows, fields] = await pool.query(
    `UPDATE employee SET firstname = ?, lastname = ?, dept_id = ?, emp_type = ? WHERE id = ?`,
    [firstname, lastname, dept_id, emp_type, id]
  );
  res.json({
    message: "Employee Added Successfully",
  });
});

app.get("/get-emplist", async (req, res) => {
  const [rows, fields] = await pool.query(
    `SELECT e.id,firstname, lastname, emp_type, dept_id, d.name as dept_name FROM employee as e, department d where e.dept_id =d.id`
  );
  res.send(rows);
});

app.post("/add-department", async (req, res) => {
  const { name, abbr } = req.body;
  const [rows, fields] = await pool.query(
    `INSERT into department(name, abbr) VALUES(?,?)`,
    [name, abbr]
  );
  res.json({ message: "department added successfully" });
});

app.get("/department-list", async (req, res) => {
  const { name, abbr } = req.query;
  const [rows, fields] = await pool.query(`SELECT * FROM department`);
  res.status(200).json(rows);
});
// student

app.post("/add-student", async (req, res) => {
  const { stud_firstname, stud_lastname, dept_id, stud_type } = req.body;
  const [rows, fields] = await pool.query(
    `Insert into student(stud_firstname, stud_lastname, dept_id, stud_type) VALUES(?,?,?,?)`,
    [stud_firstname, stud_lastname, dept_id, stud_type]
  );
  res.json({ message: "student added successfully" });
});

app.get("/get-studentlist", async (req, res) => {
  // const { stud_firstname, stud_lastname, dept_id, stud_type } = req.query;
  const [rows, fields] = await pool.query(
    `SELECT s.stud_id,stud_firstname, stud_lastname, stud_type, dept_id, d.name as dept_name FROM student as s, department d WHERE s.dept_id =d.id;`
  );

  res.send(rows);
});

app.get("/get-studentById", async (req, res) => {
  const { stud_id } = req.query;
  const [rows, fields] = await pool.query(
    `SELECT * from student WHERE stud_id=(?);`,
    [stud_id]
  );
  // console.log(rows);
  res.json(rows[0]);
});

app.post("/update-student", async (req, res) => {
  const { stud_firstname, stud_lastname, dept_id, stud_type, stud_id } =
    req.body;
  const [rows, fields] = await pool.query(
    `UPDATE student SET stud_firstname=?, stud_lastname=?, dept_id=?, stud_type=? where stud_id =?`,
    [stud_firstname, stud_lastname, dept_id, stud_type, stud_id]
  );
  res.json({
    message: "Student Updated Successfully",
  });
});

app.get("/get-person", (req, res) => {
  res.json([
    {
      id: 1,
      name: "shashi",
    },
    {
      id: 2,
      name: "shashi",
    },
  ]);
});

app.listen(port, () => {
  console.log("running on 3000");
});
