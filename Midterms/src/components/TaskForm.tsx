import React, { useState } from "react";
import type { Task } from "../types/task";
import { useAddTask } from "../hooks/useTaskManager";

const TaskForm: React.FC<{ onTaskAdded: () => void }> = ({ onTaskAdded }) => {
  const { addTask } = useAddTask();
  const [type, setType] = useState<"basic" | "timed" | "checklist">("basic");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState<{ text: string; checked: boolean }[]>([]);
  const [newItemText, setNewItemText] = useState("");

  const addItem = () => {
    if (newItemText.trim()) {
      setItems([...items, { text: newItemText, checked: false }]);
      setNewItemText("");
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        onTaskAdded();

        // Reset form
        setTitle("");
        setDescription("");
        setDueDate("");
        setItems([]);
        setType("basic");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded-lg mb-6">
      <div className="mb-4">
        <label className="block mb-2 font-medium">Task Type</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={type === "basic"}
              onChange={() => setType("basic")}
              className="mr-2"
            />
            Basic
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={type === "timed"}
              onChange={() => setType("timed")}
              className="mr-2"
            />
            Timed
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={type === "checklist"}
              onChange={() => setType("checklist")}
              className="mr-2"
            />
            Checklist
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="title" className="block mb-2 font-medium">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block mb-2 font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
          rows={3}
        />
      </div>

      {type === "timed" && (
        <div className="mb-4">
          <label htmlFor="dueDate" className="block mb-2 font-medium">
            Due Date
          </label>
          <input
            id="dueDate"
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
        </div>
      )}

      {type === "checklist" && (
        <div className="mb-4">
          <label className="block mb-2 font-medium">Checklist Items</label>
          <div className="flex mb-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              className="flex-grow mr-2 p-2 border border-gray-300 rounded"
              placeholder="New item"
            />
            <button
              type="button"
              onClick={addItem}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={index} className="flex items-center">
                <span className="flex-grow">{item.text}</span>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
