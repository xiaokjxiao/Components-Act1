import React, { useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Notification from "./components/Notification";

const App: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
            Task Manager
          </h1>
          <p className="mt-3 text-xl text-gray-600 max-w-2xl mx-auto">
            A modern task management application with advanced design patterns
          </p>
        </div>

        <Notification />

        <div className="mb-8 text-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 
            text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 
            transform hover:scale-105 shadow-md flex items-center mx-auto"
          >
            <span className="mr-2">{showForm ? "Hide Form" : "Add New Task"}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              {showForm ? (
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              )}
            </svg>
          </button>
        </div>

        {showForm && (
          <div className="mb-10 transition-all duration-300 animate-fadeIn">
            <TaskForm onTaskAdded={() => setShowForm(false)} />
          </div>
        )}

        <TaskList />
      </div>
    </div>
  );
};

export default App;
