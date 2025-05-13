import { supabase } from '../api/supabase';
import type { Task } from '../types/task';
import { TaskAdapter } from '../api/TaskAdapter';

class TaskManager {
  private static instance: TaskManager;

  private constructor() {}

  public static getInstance(): TaskManager {
    if (!TaskManager.instance) {
      TaskManager.instance = new TaskManager();
    }
    return TaskManager.instance;
  }

async addTask(task: Omit<Task, 'id'>): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert(TaskAdapter.toSupabase(task as Task))
    .select()
    .single();

  if (error) throw error;
  return TaskAdapter.fromSupabase(data);
}

  async removeTask(taskId: string): Promise<void> {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) throw error;
  }

  async getTask(taskId: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .select()
      .eq('id', taskId)
      .single();

    if (error) return null;
    return TaskAdapter.fromSupabase(data);
  }

  async getAllTasks(): Promise<Task[]> {
    const { data, error } = await supabase.from('tasks').select();
    if (error) return [];
    return data.map(TaskAdapter.fromSupabase);
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null> {
    const currentTask = await this.getTask(taskId);
    if (!currentTask) return null;

    const updatedTask = { ...currentTask, ...updates };
    const { data, error } = await supabase
      .from('tasks')
      .update(TaskAdapter.toSupabase(updatedTask))
      .eq('id', taskId)
      .select()
      .single();

    if (error) return null;
    return TaskAdapter.fromSupabase(data);
  }

  async searchTasks(query: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select()
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`);

    if (error) return [];
    return data.map(TaskAdapter.fromSupabase);
  }
}

export const taskManager = TaskManager.getInstance();