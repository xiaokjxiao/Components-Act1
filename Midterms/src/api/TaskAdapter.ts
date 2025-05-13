import type { Task } from "../types/task";

interface SupabaseTask {
  id: string;
  title: string;
  description?: string | null;
  due_date?: string | null;
  completed: boolean;
  type: 'basic' | 'timed' | 'checklist';
  items?: { text: string; checked: boolean }[] | null;
}

export class TaskAdapter {
  static fromSupabase(supabaseTask: SupabaseTask): Task {
    return {
      id: supabaseTask.id,
      title: supabaseTask.title,
      description: supabaseTask.description || undefined,
      dueDate: supabaseTask.due_date || undefined,
      completed: supabaseTask.completed,
      type: supabaseTask.type,
      items: supabaseTask.items || undefined,
    };
  }

  static toSupabase(task: Task): SupabaseTask {
    return {
      id: task.id,
      title: task.title,
      description: task.description || null,
      due_date: task.dueDate || null,
      completed: task.completed,
      type: task.type,
      items: task.items || null,
    };
  }
}