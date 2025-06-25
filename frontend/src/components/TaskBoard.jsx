import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const STATUS = ["To Do", "In Progress", "Done"];

function TaskBoard({ token }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const navigate = useNavigate();

  const handleAddTask = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      "http://localhost:3000/api/tasks",
      { title, description, status },
      { headers: { token } }
    );
    const newTask = response.data?.task;
    setTasks((prev) => [...prev, newTask]);
    setTitle("");
    setDescription("");
    setStatus("To Do");
  };

  const handleGetAllTasks = async (currentToken) => {
    try {
      const response = await axios.get("http://localhost:3000/api/tasks", {
        headers: { token: currentToken },
      });
      console.log(response);

      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    const currentToken = token || localStorage.getItem("token");
    if (currentToken) {
      handleGetAllTasks(currentToken);
    }
  }, [token]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/tasks/${taskId}`,
        { status: newStatus },
        { headers: { token } }
      );
      const updatedStatus = response.data?.status;
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: updatedStatus } : task
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/tasks/${taskId}`,
        { headers: { token } }
      );
      if (response.data.status) {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!token && !localStorage.getItem("token")) {
      navigate("/");
    }
  }, [token, navigate]);

  const grouped = STATUS.map((stat) => ({
    status: stat,
    tasks: tasks.filter((t) => t.status === stat),
  }));

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6">
      <form
        onSubmit={handleAddTask}
        className="bg-white shadow-md rounded p-4 mb-6 w-full md:w-1/3 mx-auto max-h-max py-10"
      >
        <h2 className="text-xl font-bold mb-4">Add New Task</h2>
        <input
          className="w-full mb-2 p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
        />
        <textarea
          className="w-full mb-2 p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          required
        />
        <select
          className="w-full mb-2 p-2 border rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Task
        </button>
      </form>

      <div className="flex flex-1 gap-4">
        {grouped.map((group) => (
          <div key={group.status} className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{group.status}</h3>
            {group.tasks.length === 0 && (
              <div className="text-gray-400 italic">No tasks</div>
            )}
            {group.tasks.map((task) => (
              <div
                key={task.id}
                className="bg-gray-100 border rounded p-3 mb-3 shadow"
              >
                <div className="font-bold">{task.title}</div>
                <div className="text-sm text-gray-600 mb-2">
                  {task.description}
                </div>
                <select
                  className="w-full px-1 border rounded bg-gray-100"
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                >
                  {STATUS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>

                <div className="mt-1 flex justify-center p-6">
                  <button
                    className="text-sm border px-2 py-1 border-white text-white bg-red-600 rounded-lg"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskBoard;
