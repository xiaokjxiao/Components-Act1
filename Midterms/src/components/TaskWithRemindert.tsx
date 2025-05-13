import React from 'react';
import TaskFactory from './TaskFactory';
import type { Task } from '../types/task';

interface TaskWithReminderProps {
  task: Task;
}

const TaskWithReminder: React.FC<TaskWithReminderProps> = ({ task }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div className={`relative ${task.completed ? 'opacity-75' : ''}`}>
      {task.dueDate && isOverdue && (
        <div className="reminder-badge absolute top-0 right-0 -mt-1 -mr-1 flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded-full animate-pulse shadow-sm">
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      
      <TaskFactory type={task.type} task={task} />
      
      {task.completed && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded">
          <div className="bg-green-100 text-green-800 font-medium py-1 px-3 rounded-full text-sm flex items-center">
            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Completed
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskWithReminder;