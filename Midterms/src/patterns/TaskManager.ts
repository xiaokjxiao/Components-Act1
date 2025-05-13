import { supabase } from '../api/supabase';
import type { Task } from '../types/task';
import { TaskAdapter } from '../api/TaskAdapter';

class TaskManager {
  private static instance: TaskManager;

  private constructor() {
    console.log('TaskManager instance created');
  }

  public static getInstance(): TaskManager {
    if (!TaskManager.instance) {
      TaskManager.instance = new TaskManager();
    }
    return TaskManager.instance;
  }

async addTask(task: Omit<Task, 'id'>): Promise<Task> {
  console.log('Adding task:', task);
  
  // Log what's being sent to Supabase
  const supabaseTask = TaskAdapter.toSupabase(task as Task);
  console.log('Converted task for Supabase:', supabaseTask);
  
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert(supabaseTask)
      .select()
      .single();

    if (error) {
      console.error('Error adding task:', error);
      throw error;
    }
    
    console.log('Task added successfully:', data);
    return TaskAdapter.fromSupabase(data);
  } catch (err) {
    console.error('Exception in addTask:', err);
    throw err;
  }
}

  async removeTask(taskId: string): Promise<void> {
    console.log('Removing task:', taskId);
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) {
      console.error('Error removing task:', error);
      throw error;
    }
    console.log('Task removed successfully');
  }

  async getTask(taskId: string): Promise<Task | null> {
    console.log('Getting task:', taskId);
    const { data, error } = await supabase
      .from('tasks')
      .select()
      .eq('id', taskId)
      .single();

    if (error) {
      console.error('Error getting task:', error);
      return null;
    }
    return TaskAdapter.fromSupabase(data);
  }

  async getAllTasks(): Promise<Task[]> {
    console.log('Getting all tasks');
    const { data, error } = await supabase.from('tasks').select();
    if (error) {
      console.error('Error getting all tasks:', error);
      return [];
    }
    console.log(`Retrieved ${data?.length || 0} tasks`);
    return data.map(TaskAdapter.fromSupabase);
  }
  
  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null> {
    console.log('Updating task:', taskId, 'with:', updates);
    const currentTask = await this.getTask(taskId);
    if (!currentTask) {
      console.log('Task not found for update');
      return null;
    }

    const updatedTask = { ...currentTask, ...updates };
    console.log('Full updated task object:', updatedTask);
    
    const supabaseTask = TaskAdapter.toSupabase(updatedTask);
    console.log('Converted task for update:', supabaseTask);
    
    const { data, error } = await supabase
      .from('tasks')
      .update(supabaseTask)
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      return null;
    }
    console.log('Task updated successfully:', data);
    return TaskAdapter.fromSupabase(data);
  }

  async searchTasks(query: string): Promise<Task[]> {
    console.log('Searching tasks with query:', query);
    const { data, error } = await supabase
      .from('tasks')
      .select()
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`);

    if (error) {
      console.error('Error searching tasks:', error);
      return [];
    }
    console.log(`Found ${data?.length || 0} tasks matching query`);
    return data.map(TaskAdapter.fromSupabase);
  }
}

export const taskManager = TaskManager.getInstance();