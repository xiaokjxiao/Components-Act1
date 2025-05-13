import React from 'react';
import type { Task } from '../types/task';
interface TaskFactoryProps {
  type: 'basic' | 'timed' | 'checklist';
  task: Task;
}

const BasicTask: React.FC<{ task: Task }> = ({ task }) => (
  <div className="task-card">
    <h3 className="font-bold text-lg">{task.title}</h3>
    {task.description && <p className="text-gray-600 mt-1">{task.description}</p>}
  </div>
);

const TimedTask: React.FC<{ task: Task }> = ({ task }) => (
  <div className="task-card">
    <h3 className="font-bold text-lg">{task.title}</h3>
    {task.description && <p className="text-gray-600 mt-1">{task.description}</p>}
    {task.dueDate && (
      <p className="text-sm text-gray-500 mt-2">
        Due: {new Date(task.dueDate).toLocaleString()}
      </p>
    )}
  </div>
);

const ChecklistTask: React.FC<{ task: Task }> = ({ task }) => (
  <div className="task-card">
    <h3 className="font-bold text-lg">{task.title}</h3>
    <ul className="mt-2 space-y-1">
      {task.items?.map((item, index) => (
        <li key={index} className="flex items-center">
          <input
            type="checkbox"
            checked={item.checked}
            readOnly
            className="mr-2"
          />
          <span className={item.checked ? 'line-through text-gray-400' : ''}>
            {item.text}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

const TaskFactory: React.FC<TaskFactoryProps> = ({ type, task }) => {
  switch (type) {
    case 'basic':
      return <BasicTask task={task} />;
    case 'timed':
      return <TimedTask task={task} />;
    case 'checklist':
      return <ChecklistTask task={task} />;
    default:
      throw new Error(`Unknown task type: ${type}`);
  }
};

export default TaskFactory;