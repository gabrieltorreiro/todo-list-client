"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Task {
  id: number;
  name: string;
  status: boolean;
}

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<string>("");

  const baseURL = "http://localhost:5000";

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${baseURL}/task`);
        setTasks(response.data);
      } catch (err) {
        setError("Erro ao buscar tarefas");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    try {
      const response = await axios.post(`${baseURL}/task`, { name: newTask });
      setTasks([...tasks, response.data]);
      setNewTask("");
    } catch (err) {
      setError("Erro ao adicionar tarefa");
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await axios.delete(`${baseURL}/task/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      setError("Erro ao deletar tarefa");
    }
  };

  const handleUpdateTask = async (id: number, status: boolean) => {
    try {
      if (status) await axios.patch(`${baseURL}/task/${id}/done`);
      else await axios.patch(`${baseURL}/task/${id}/undone`);
      setTasks(
        tasks.map((task) => (task.id === id ? { ...task, status } : task))
      );
    } catch (err) {
      setError("Erro ao atualizar tarefa");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center sm:w-11/12 lg:w-5/12 mx-auto">
      <div className="flex flex-col items-center p-4 w-full">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-auto"
        >
          {isEditing ? "Concluir" : "Editar"}
        </button>
        <h1 className="text-3xl font-bold mb-6">Tarefas</h1>
        <ul className="w-full max-w-md shadow-md rounded-lg p-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`cursor-pointer flex justify-between items-center p-2 ${
                task.status ? "opacity-40 line-through" : "text-white-700"
              } capitalize`}
              onClick={() =>
                !isEditing && handleUpdateTask(task.id, !task.status)
              }
            >
              <span>{task.name}</span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTask(task.id);
                }}
                className={`ml-4 px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 ${
                  isEditing ? "visible" : "invisible"
                }`}
              >
                Excluir
              </button>
            </li>
          ))}
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className={`mt-3 p-2 border border-gray-300 rounded-lg bg-transparent w-full ${
              isAdding ? "visible" : "invisible"
            }`}
            placeholder="Digite nome da tarefa"
          />
        </ul>
      </div>
      <div className="flex flex-col items-center p-4 w-full mb-auto">
        <button
          onClick={() => {
            setIsAdding(!isAdding);
            if (isAdding) handleAddTask();
          }}
          className="flex justify-center px-4 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-11/12"
        >
          {isAdding ? "Concluir" : "Adicionar"}
        </button>
      </div>
    </div>
  );
};

export default TasksPage;
