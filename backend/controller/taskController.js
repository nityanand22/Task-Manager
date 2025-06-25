const db = require("../database/db");

const addTask = async (req, res) => {
  const userId = req.userId;
  const { title, description, status } = req.body;
  try {
    const [taskId] = await db("tasks").insert({
      title,
      description,
      status,
      user_id: userId,
    });
    const task = await db("tasks").where({ id: taskId }).first();
    return res.status(200).json({
      status: true,
      message: "Task added successfully",
      task,
    });
  } catch (error) {
    console.error("Error adding task:", error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getAllTask = async (req, res) => {
  const userId = req.userId;
  try {
    const tasks = await db("tasks").where({ user_id: userId });
    res.json(tasks);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const updateStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  const userId = req.userId;

  try {
    const task = await db("tasks").where({ id, user_id: userId }).first();
    if (!task) return res.status(404).json({ error: "Task not found" });

    await db("tasks").where({ id }).update({ status });
    const updatedTask = await db("tasks").where({ id }).first();
    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task status:", error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const task = await db("tasks").where({ id, user_id: userId }).first();
    if (!task) return res.status(404).json({ error: "Task not found" });

    await db("tasks").where({ id }).del();
    res.json({ status: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = { addTask, getAllTask, updateStatus, deleteTask };
