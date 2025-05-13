import { useState, useCallback, useEffect } from "react";
import { taskManager } from "../patterns/TaskManager";
import type { Task } from "../types/task";

// Hook for adding a task
export const useAddTask = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addTask = useCallback(async (task: Omit<Task, "id">) => {
    setIsLoading(true);
    setError(null);
    try {
      const newTask = await taskManager.addTask(task);
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to add task"));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { addTask, isLoading, error };
};

// Hook for removing a task
export const useRemoveTask = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const removeTask = useCallback(async (taskId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await taskManager.removeTask(taskId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to remove task"));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { removeTask, isLoading, error };
};

// Hook for getting a single task by ID
export const useGetTask = (taskId?: string) => {
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTask = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedTask = await taskManager.getTask(id);
      setTask(fetchedTask);
      return fetchedTask;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to get task"));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (taskId) {
      fetchTask(taskId);
    }
  }, [taskId, fetchTask]);

  return { task, isLoading, error, refetch: fetchTask };
};

// Hook for getting all tasks
export const useGetAllTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedTasks = await taskManager.getAllTasks();
      setTasks(fetchedTasks);
      return fetchedTasks;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch tasks"));
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, isLoading, error, refetch: fetchTasks };
};

// Hook for updating a task
export const useUpdateTask = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateTask = useCallback(
    async (taskId: string, updates: Partial<Task>) => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedTask = await taskManager.updateTask(taskId, updates);
        return updatedTask;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to update task")
        );
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { updateTask, isLoading, error };
};

// Hook for marking a task as completed
export const useCompleteTask = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const completeTask = useCallback(async (taskId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedTask = await taskManager.updateTask(taskId, {
        completed: true,
      });
      return updatedTask;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to complete task")
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  return { completeTask, isLoading, error };
};

// Hook for marking a checklist item as completed
export const useCompleteChecklistItem = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const completeChecklistItem = useCallback(
    async (taskId: string, itemIndex: number) => {
      setIsLoading(true);
      setError(null);
      try {
        const task = await taskManager.getTask(taskId);
        if (!task || !task.items) {
          throw new Error("Task or items not found");
        }
        const updatedItems = [...task.items];
        updatedItems[itemIndex].checked = true;
        const updatedTask = await taskManager.updateTask(taskId, {
          items: updatedItems,
        });
        return updatedTask;
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to complete checklist item")
        );
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );
  return { completeChecklistItem, isLoading, error };
};

// Hook for searching tasks
export const useSearchTasks = () => {
  const [results, setResults] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const searchTasks = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const searchResults = await taskManager.searchTasks(query);
      setResults(searchResults);
      return searchResults;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to search tasks")
      );
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { searchTasks, results, isLoading, error };
};

// Combined hook for common task operations
export const useTasks = () => {
  const {
    tasks,
    isLoading: isLoadingTasks,
    error: tasksError,
    refetch,
  } = useGetAllTasks();
  const { addTask, isLoading: isAddingTask, error: addError } = useAddTask();
  const {
    removeTask,
    isLoading: isRemovingTask,
    error: removeError,
  } = useRemoveTask();
  const {
    updateTask,
    isLoading: isUpdatingTask,
    error: updateError,
  } = useUpdateTask();

  const isLoading =
    isLoadingTasks || isAddingTask || isRemovingTask || isUpdatingTask;
  const error = tasksError || addError || removeError || updateError;

  return {
    tasks,
    addTask,
    removeTask,
    updateTask,
    refetch,
    isLoading,
    error,
  };
};
