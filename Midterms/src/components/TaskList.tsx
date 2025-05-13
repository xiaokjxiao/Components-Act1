import React, { useState, useEffect } from 'react';
import type { Task } from '../types/task';
import TaskWithReminder from './TaskWithRemindert';
import { taskManager } from '../patterns/TaskManager';
import TaskSortingStrategy from '../patterns/TaskSortingStrategy';
import { taskNotifier } from '../patterns/TaskNotifier';
import { supabase } from '../api/supabase';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMethod, setSortMethod] = useState<'date' | 'name' | 'id'>('date');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      try {
        const allTasks = await taskManager.getAllTasks();
        setTasks(allTasks);
        taskNotifier.checkForOverdueTasks(allTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();

    // Set up realtime subscription
    const subscription = supabase
      .channel('tasks')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        () => loadTasks()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleDelete = async (taskId: string) => {
    try {
      await taskManager.removeTask(taskId);
      const updatedTasks = await taskManager.getAllTasks();
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    try {
      const task = await taskManager.getTask(taskId);
      if (task) {
        await taskManager.updateTask(taskId, { completed: !task.completed });
        const updatedTasks = await taskManager.getAllTasks();
        setTasks(updatedTasks);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const filteredTasks = searchQuery
    ? tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : tasks;

  const sortedTasks = (() => {
    switch (sortMethod) {
      case 'date':
        return TaskSortingStrategy.sortByDate(filteredTasks);
      case 'name':
        return TaskSortingStrategy.sortByName(filteredTasks);
      case 'id':
        return TaskSortingStrategy.sortById(filteredTasks);
      default:
        return filteredTasks;
    }
  })();

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label className="whitespace-nowrap">Sort by:</label>
          <select
            value={sortMethod}
            onChange={(e) => setSortMethod(e.target.value as 'date' | 'name' | 'id')}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="date">Due Date</option>
            <option value="name">Name</option>
            <option value="id">Creation Date</option>
          </select>
        </div>
      </div>

      {sortedTasks.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          {searchQuery ? 'No matching tasks found' : 'No tasks yet. Add one!'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTasks.map((task) => (
            <div key={task.id} className="bg-white p-4 rounded-lg shadow-md">
              <TaskWithReminder task={task} />
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => handleToggleComplete(task.id)}
                  className={`px-3 py-1 rounded text-sm ${
                    task.completed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {task.completed ? 'Completed' : 'Mark Complete'}
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="px-3 py-1 rounded bg-red-100 text-red-800 text-sm"
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