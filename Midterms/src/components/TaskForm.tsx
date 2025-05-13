import type React from "react";
import { useState } from "react";
import type { Task } from "../types/task";
import { useAddTask } from "../hooks/useTaskManager";

const TaskForm: React.FC<{ onTaskAdded: (newTask: Task) => void }> = ({ onTaskAdded }) => {
  const { addTask } = useAddTask();
  const [type, setType] = useState<"basic" | "timed" | "checklist">("basic");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState<{ text: string; checked: boolean }[]>([]);
  const [newItemText, setNewItemText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addItem = () => {
    if (newItemText.trim()) {
      setItems([...items, { text: newItemText, checked: false }]);
      setNewItemText("");
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

// Add this function near the top of your component
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (isSubmitting) return;
  setIsSubmitting(true);

  try {
    // Create base task object
    const taskData: Omit<Task, "id"> = {
      title,
      description,
      type,
      completed: false,
    };

    // Only add dueDate field if task type is 'timed' and there is a value
    if (type === "timed" && dueDate) {
      taskData.dueDate = dueDate;
    }

    // Only add items field if task type is 'checklist' and there are items
    if (type === "checklist" && items.length > 0) {
      taskData.items = items;
    }

    const result = await addTask(taskData);

    if (result) {
      // Reset form
      setTitle("");
      setDescription("");
      setDueDate("");
      setItems([]);
      setType("basic");

      // Close modal & trigger refresh
      onTaskAdded({ ...taskData, id: result.id });
    }
  } catch (error) {
    console.error("Error adding task:", error);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-[#40513B] mb-2">
          Task Type
        </label>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={type === "basic"}
              onChange={() => setType("basic")}
              className="h-5 w-5 text-[#609966] border-[#9DC08B] focus:ring-[#609966]"
            />
            <span className="ml-2 text-[#40513B]">Basic</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={type === "timed"}
              onChange={() => setType("timed")}
              className="h-5 w-5 text-[#609966] border-[#9DC08B] focus:ring-[#609966]"
            />
            <span className="ml-2 text-[#40513B]">Timed</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={type === "checklist"}
              onChange={() => setType("checklist")}
              className="h-5 w-5 text-[#609966] border-[#9DC08B] focus:ring-[#609966]"
            />
            <span className="ml-2 text-[#40513B]">Checklist</span>
          </label>
        </div>
      </div>

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-[#40513B]"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full block p-2 h-10 rounded-md border-[#9DC08B] shadow-sm focus:border-[#609966] focus:ring focus:ring-[#609966] focus:ring-opacity-50"
          required
          placeholder="Enter task title"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-[#40513B] mb-1"
        >
          Description
        </label>
        <textarea
          placeholder="Enter task description"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full p-2 resize-none rounded-md border-[#9DC08B] shadow-sm focus:border-[#609966] focus:ring focus:ring-[#609966] focus:ring-opacity-50"
          rows={3}
        />
      </div>

      {type === "timed" && (
        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-[#40513B] mb-1"
          >
            Due Date
          </label>
          <input
            id="dueDate"
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="block w-full p-2 h-10 rounded-md border-[#9DC08B] shadow-sm focus:border-[#609966] focus:ring focus:ring-[#609966] focus:ring-opacity-50"
          />
        </div>
      )}

      {type === "checklist" && (
        <div>
          <label className="block text-sm font-medium text-[#40513B] mb-2">
            Checklist Items
          </label>
          <div className="flex mb-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              className="flex-grow mr-2 p-2 rounded-md border-[#9DC08B] shadow-sm focus:border-[#609966] focus:ring focus:ring-[#609966] focus:ring-opacity-50"
              placeholder="New item"
            />
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#609966] hover:bg-[#40513B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#609966] transition-colors duration-200"
            >
              Add
            </button>
          </div>
          {items.length > 0 && (
            <ul className="mt-3 max-h-40 overflow-y-auto border border-[#9DC08B] rounded-md divide-y divide-[#EDF1D6] bg-white">
              {items.map((item, index) => (
                <li
                  key={index}
                  className="px-4 py-3 flex items-center justify-between"
                >
                  <span className="text-sm text-[#40513B]">{item.text}</span>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-[#40513B] hover:text-red-600 transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="pt-4 flex justify-end gap-x-3">
        <button
          type="button"
          onClick={() => onTaskAdded({ id: "", title: "", completed: false, type, description, dueDate, items })}
          className="px-5 py-2.5 border border-[#9DC08B] rounded-md shadow-sm text-sm font-medium text-[#40513B] bg-white hover:bg-[#EDF1D6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#609966] transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isSubmitting
              ? "bg-[#609966]/70 cursor-not-allowed"
              : "bg-[#609966] hover:bg-[#40513B]"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#609966] transition-colors duration-200 flex items-center`}
        >
          {isSubmitting && (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {isSubmitting ? "Adding..." : "Add Task"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
