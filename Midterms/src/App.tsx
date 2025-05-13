"use client";

import type React from "react";
import { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Notification from "./components/Notification";
import Modal from "./components/Modal";
import { useGetAllTasks } from "./hooks/useTaskManager";
import type { Task } from "./types/task";

const App: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  // Get tasks from the hook
  const { tasks, isLoading, error, refetch } = useGetAllTasks();
  // Create a local copy of tasks for immediate UI updates
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  
  // Keep local tasks in sync with server tasks
  useEffect(() => {
    if (tasks) {
      setLocalTasks(tasks);
    }
  }, [tasks]);
  
  const handleTaskAdded = (newTask: Task) => {
    // Add the new task to local tasks immediately
    setLocalTasks(prev => [newTask, ...prev]);
    // Close the modal
    setShowModal(false);
    // Also refresh from server to ensure consistency
    refetch();
  };

  return (
    <div className="min-h-screen bg-[#EDF1D6]/30 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#40513B]">Task Manager ng MAMAMO</h1>
        </div>

        <Notification />

        <div className="mb-8 text-center">
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#609966] hover:bg-[#40513B] text-white font-medium py-3 px-6 rounded-lg shadow-sm transition-all duration-200 flex items-center mx-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Task
          </button>
        </div>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Create New Task"
        >
          <TaskForm onTaskAdded={handleTaskAdded} />
        </Modal>

        <TaskList tasks={localTasks} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
};

export default App;