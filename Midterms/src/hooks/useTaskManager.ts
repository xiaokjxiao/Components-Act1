import { useState, useCallback, useEffect } from "react";
import { taskManager } from "../patterns/TaskManager";
import type { Task } from "../types/task";

// Hook for adding a task
export function useAddTask() {
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
}

// Hook for removing a task
export function useRemoveTask() {
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
}

// Hook for getting a single task by ID
export function useGetTask(taskId?: string) {
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
}

// Hook for getting all tasks
export function useGetAllTasks() {
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
}

// Hook for updating a task
export function useUpdateTask() {
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
}

// Hook for searching tasks
export function useSearchTasks() {
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
}

// Combined hook for common task operations
export function useTasks() {
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
}
