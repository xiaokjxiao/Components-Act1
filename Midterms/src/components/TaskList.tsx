import React, { useState, useCallback } from "react";
import TaskWithReminder from "./TaskWithReminder";
import TaskSortingStrategy from "../patterns/TaskSortingStrategy";
import { taskNotifier } from "../patterns/TaskNotifier";
import {
  useUpdateTask,
  useRemoveTask,
  useCompleteTask,
} from "../hooks/useTaskManager";
import type { Task } from "../types/task";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, isLoading, error }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMethod, setSortMethod] = useState<"date" | "name" | "id">("date");

  // Only get operations, not tasks since they're coming from props
  const { completeTask } = useCompleteTask();
  const { updateTask } = useUpdateTask();
  const { removeTask } = useRemoveTask();

  // Local state for optimistic UI updates
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  
  // Sync local tasks when props change
  React.useEffect(() => {
    setLocalTasks(tasks);
    if (tasks.length > 0) {
      taskNotifier.checkForOverdueTasks(tasks);
    }
  }, [tasks]);

  // Check for overdue tasks periodically
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      if (localTasks.length > 0) {
        taskNotifier.checkForOverdueTasks(localTasks);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [localTasks]);

  const handleDelete = useCallback(async (taskId: string) => {
    try {
      // Optimistic UI update
      setLocalTasks(prev => prev.filter(task => task.id !== taskId));
      
      // Actual API call
      await removeTask(taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
      // Revert optimistic update if error occurs
      setLocalTasks(tasks);
    }
  }, [removeTask, tasks]);

  const handleToggleComplete = useCallback(async (taskId: string) => {
  try {
    // Find task in local state
    const taskIndex = localTasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    // Get current state and prepare update
    const task = localTasks[taskIndex];
    const newCompletedState = !task.completed;
    
    // Optimistic UI update
    const updatedLocalTasks = [...localTasks];
    updatedLocalTasks[taskIndex] = {
      ...task,
      completed: newCompletedState
    };
    setLocalTasks(updatedLocalTasks);
    
    // Use appropriate hook based on the new state
    if (newCompletedState) {
      // If marking as complete, use the specialized hook
      await completeTask(taskId);
    } else {
      // If marking as incomplete, use the general update hook
      await updateTask(taskId, { completed: false });
    }
  } catch (error) {
    console.error("Error updating task:", error);
    // Revert optimistic update if error occurs
    setLocalTasks(tasks);
  }
}, [localTasks, completeTask, updateTask, tasks]);

  // Rest of your component remains largely the same...
  const filteredTasks = searchQuery
    ? localTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.description &&
            task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : localTasks;


  // Sort tasks based on the selected method
  
  const sortedTasksByDate = TaskSortingStrategy.sortByDate(filteredTasks);
  const sortedTasksByName = TaskSortingStrategy.sortByName(filteredTasks);
  const sortedTasksById = TaskSortingStrategy.sortById(filteredTasks);

  const sortedTasks = (() => {
    switch (sortMethod) {
      case "date":
        return sortedTasksByDate;
      case "name":
        return sortedTasksByName;
      case "id":
        return sortedTasksById;
      default:
        return filteredTasks;
    }
  })();

  if (isLoading && localTasks.length === 0) {
    return (
      <div className="text-center py-8 text-[#40513B] font-medium">
        <div className="animate-pulse">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600 bg-[#EDF1D6] p-4 rounded-lg border border-red-300">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#EDF1D6] p-4 rounded-lg shadow-sm">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-[#9DC08B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#609966] bg-white placeholder-[#40513B]/50"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label className="whitespace-nowrap text-[#40513B] font-medium">
            Sort by:
          </label>
          <select
            value={sortMethod}
            onChange={(e) =>
              setSortMethod(e.target.value as "date" | "name" | "id")
            }
            className="p-3 border border-[#9DC08B] rounded-lg bg-white text-[#40513B] focus:outline-none focus:ring-2 focus:ring-[#609966]"
          >
            <option value="date">Due Date</option>
            <option value="name">Name</option>
            <option value="id">Creation Date</option>
          </select>
        </div>
      </div>

      {sortedTasks.length === 0 ? (
        <div className="text-center text-[#40513B] py-12 bg-[#EDF1D6] rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto mb-4 text-[#9DC08B]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-lg font-medium">
            {searchQuery ? "No matching tasks found" : "No tasks yet. Add one!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-[#EDF1D6] hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-5 bg-gradient-to-r from-[#EDF1D6] to-[#EDF1D6]/50">
                <TaskWithReminder task={task} />
              </div>
              <div className="flex justify-between p-3 bg-[#EDF1D6]/30 border-t border-[#EDF1D6]">
                <button
                  
                  // Onclick it will mark the task as complete or incomplete
                  onClick={() => handleToggleComplete(task.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    task.completed
                      ? "bg-[#9DC08B] text-white hover:bg-[#609966]"
                      : "bg-[#EDF1D6] text-[#40513B] hover:bg-[#9DC08B] hover:text-white"
                  }`}
                >
                  {task.completed ? "Completed" : "Mark Complete"}
                </button>
                <button
                  // Onclick it will delete the task
                  onClick={() => handleDelete(task.id)}
                  className="px-4 py-2 rounded-md bg-white text-[#40513B] border border-[#40513B] text-sm font-medium hover:bg-[#40513B] hover:text-white transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;