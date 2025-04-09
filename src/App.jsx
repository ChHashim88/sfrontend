import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://taskmanagementbackendeve.netlify.app/.netlify/functions/tasks";


export default function App() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", status: "pending" });
  const [filterStatus, setFilterStatus] = useState("all");


  const fetchTasks = async (status = "all") => {
    try {
      const res = await axios.get(API_URL, {
        params: { status: status !== "all" ? status : undefined },
      });
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  
  const handleSubmit = async () => {
    try {
      const res = await axios.post(API_URL, newTask);
      
      setTasks([...tasks, res.data]);
      setShowModal(false);
      
      setNewTask({ title: "", description: "", status: "pending" });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  
  const toggleStatus = async (id, currentStatus) => {
    const updatedStatus = currentStatus === "pending" ? "completed" : "pending";
    try {
      await axios.put(`${API_URL}/${id}`, { status: updatedStatus });
      fetchTasks(filterStatus); 
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    fetchTasks(status);
  };


  useEffect(() => {
    fetchTasks(filterStatus);
  }, [filterStatus]);

  return (
    <div className="p-6 bg-[#1F2937] min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">Task Manager</h1>
      
      
      <div className="mb-6 text-center">
        <button
          className="px-4 py-2 bg-[#2563EB] hover:bg-[#1E3A8A] rounded-lg text-white mr-4"
          onClick={() => handleFilterChange("all")}
        >
          Show All
        </button>
        <button
          className="px-4 py-2 bg-[#4CAF50] hover:bg-[#388E3C] rounded-lg text-white mr-4"
          onClick={() => handleFilterChange("pending")}
        >
          Show Pending
        </button>
        <button
          className="px-4 py-2 bg-[#FF5722] hover:bg-[#D32F2F] rounded-lg text-white"
          onClick={() => handleFilterChange("completed")}
        >
          Show Completed
        </button>
      </div>
      
      
      <button
        className="px-6 py-3 bg-[#2563EB] hover:bg-[#1E3A8A] rounded-lg mb-6 shadow-lg transition-all"
        onClick={() => setShowModal(true)}
      >
        Add Task
      </button>
      
      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#1E3A8A] p-8 rounded-lg w-96 shadow-2xl">
            <h2 className="text-2xl font-semibold mb-6">Add Task</h2>
            <input
              type="text"
              name="title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Task Title"
              className="w-full p-3 mb-4 bg-[#4B5563] rounded-lg focus:outline-none"
            />
            <textarea
              name="description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Task Description"
              className="w-full p-3 mb-4 bg-[#4B5563] rounded-lg focus:outline-none"
            />
            
            <select
              name="status"
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              className="w-full p-3 mb-4 bg-[#4B5563] rounded-lg focus:outline-none"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white"
                onClick={handleSubmit}
              >
                Create
              </button>
              <button
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      
      <ul className="space-y-6 mt-6">
        {tasks.map((task) => (
          <li key={task._id} className="p-4 rounded-lg bg-[#4B5563] shadow-md flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">{task.title}</h3>
              <p>{task.description}</p>
              <p className="text-sm mt-2">Status: {task.status}</p>
            </div>
            <div className="flex space-x-4">
              <button
                className="px-3 py-2 bg-[#FF5722] hover:bg-[#D32F2F] text-white rounded-lg"
                onClick={() => handleDelete(task._id)}
              >
                Delete
              </button>
              <button
                className={`px-3 py-2 ${task.status === "pending" ? "bg-[#4CAF50]" : "bg-[#FF5722]"} text-white rounded-lg`}
                onClick={() => toggleStatus(task._id, task.status)}
              >
                {task.status === "pending" ? "Complete" : "Reopen"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
