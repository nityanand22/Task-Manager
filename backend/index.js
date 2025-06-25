const express = require("express");
const { signup, login } = require("./controller/userController");
require("dotenv").config();
const cors = require("cors");
const userAuth = require("./middleware/userAuth");
const {
  addTask,
  getAllTask,
  updateStatus,
  deleteTask,
} = require("./controller/taskController");

let app = express();
app.use(express.json());
app.use(cors());

app.post("/api/signup", signup);
app.post("/api/login", login);
app.post("/api/tasks", userAuth, addTask);
app.get("/api/tasks", userAuth, getAllTask);
app.put("/api/tasks/:id", userAuth, updateStatus);
app.delete("/api/tasks/:id", userAuth, deleteTask);

app.listen(process.env.DB_PORT, () => {
  console.log("Server is running");
});
