import type React from "react";
import { BasicTask, TimedTask, ChecklistTask } from "./TaskFactory";
import type { Task } from "../types/task";

interface TaskWithReminderProps {
  task: Task;
  onCompleteItem?: (itemIndex: number) => Promise<void>;
}

const TaskWithReminder: React.FC<TaskWithReminderProps> = ({ task }) => {
  // Check if task has a due date and is not completed
  const hasDueDate = Boolean(task.dueDate);
  const isOverdue =
    hasDueDate && new Date(task.dueDate!) < new Date() && !task.completed;

  return (
    <div className={`relative ${task.completed ? "opacity-75" : ""}`}>

      {/* reminder badge only shown for tasks with due dates */}
      {hasDueDate && (
        <div
          className={`reminder-badge absolute top-0 right-0 -mt-1 -mr-1 flex items-center justify-center w-8 h-8 ${
            isOverdue ? "bg-red-500" : "bg-amber-400"
          } text-white rounded-full shadow-md z-10 ${
            isOverdue ? "animate-pulse" : ""
          }`}
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* TaskFactory that creates UI components based on a type string e.g., "basic", "timed", "checklist" */}
      {task.type === "basic" && <BasicTask task={task} />}
      {task.type === "timed" && <TimedTask task={task} />}
      {task.type === "checklist" && <ChecklistTask task={task} />}

      {task.completed && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded backdrop-blur-sm">
          <div className="bg-[#9DC08B] text-white font-medium py-2 px-4 rounded-full text-sm flex items-center shadow-sm">
            <svg
              className="h-4 w-4 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Completed
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskWithReminder;
