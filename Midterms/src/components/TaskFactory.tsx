import type React from "react";
import type { Task } from "../types/task";
import {
  useCompleteChecklistItem,
  useUpdateTask,
} from "../hooks/useTaskManager";
import { useEffect, useState } from "react";

export const BasicTask: React.FC<{ task: Task }> = ({ task }) => (
  <div className="task-card">
    <h3 className="font-bold text-xl text-[#40513B] mb-2">{task.title}</h3>
    {task.description && (
      <p className="text-[#609966] mt-1">{task.description}</p>
    )}
  </div>
);

export const TimedTask: React.FC<{ task: Task }> = ({ task }) => {
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div className="task-card">
      <h3 className="font-bold text-xl text-[#40513B] mb-2">{task.title}</h3>
      {task.description && (
        <p className="text-[#609966] mt-1">{task.description}</p>
      )}
      {task.dueDate && (
        <div
          className={`mt-3 flex items-center ${
            isOverdue ? "text-red-600" : "text-[#609966]"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className={`text-sm ${isOverdue ? "font-medium" : ""}`}>
            Due: {new Date(task.dueDate).toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};

export const ChecklistTask: React.FC<{ task: Task }> = ({ task }) => {
  const { completeChecklistItem } = useCompleteChecklistItem();
  const { updateTask } = useUpdateTask();
  const [localItems, setLocalItems] = useState(task.items || []);

  // Keep local items in sync with task items when task updates from outside
  useEffect(() => {
    if (task.items) {
      setLocalItems(task.items);
    }
  }, [task.items]);

  const handleCheckboxChange = async (itemIndex: number) => {
    if (!task.items) return;
    
    try {
      // Create a copy of the items array
      const updatedItems = [...localItems];
      
      // Toggle the checked status of the clicked item
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        checked: !updatedItems[itemIndex].checked
      };
      
      // Update local state immediately (optimistic update)
      setLocalItems(updatedItems);
      
      // Send update to server
      await completeChecklistItem(task.id, itemIndex);
      
      // Calculate if all items are checked
      const allChecked = updatedItems.every(item => item.checked);
      
      // If all items are checked, mark task as completed
      if (allChecked && !task.completed) {
        await updateTask(task.id, { completed: true });
      } else if (!allChecked && task.completed) {
        await updateTask(task.id, { completed: false });
      }
    } catch (error) {
      console.error('Error updating checklist item:', error);
      // Revert to original items if there's an error
      setLocalItems(task.items);
    }
  };

  return (
    <div className="task-card">
      <h3 className="font-bold text-xl text-[#40513B] mb-2">{task.title}</h3>
      {task.description && (
        <p className="text-[#609966] mb-3">{task.description}</p>
      )}
      
      <div className="mt-2">
        <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {localItems.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 pt-0.5">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleCheckboxChange(index)}
                  className="h-5 w-5 rounded border-[#9DC08B] text-[#609966] focus:ring-[#609966] transition-colors duration-200"
                />
              </div>
              <span className={`text-[#40513B] ${
                item.checked ? "line-through text-[#40513B]/70" : ""
              }`}>
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};