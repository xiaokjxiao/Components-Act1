import type { Task } from "../types/task";
import { supabase } from '../api/supabase';

type Subscriber = (task: Task, message: string) => void;

class TaskNotifier {
  private subscribers: Subscriber[] = [];
  private notifiedTasks: Set<string> = new Set();

  subscribe(subscriber: Subscriber): void {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: Subscriber): void {
    this.subscribers = this.subscribers.filter(sub => sub !== subscriber);
  }

  notify(task: Task, message: string): void {
    // Avoid duplicate notifications for the same task in a single session
    const notificationKey = `${task.id}-${message}`;
    if (this.notifiedTasks.has(notificationKey)) return;
    
    this.notifiedTasks.add(notificationKey);
    this.subscribers.forEach(subscriber => subscriber(task, message));
  }

  checkForOverdueTasks(tasks: Task[]): void {
    const now = new Date();
    tasks.forEach(task => {
      if (task.dueDate && new Date(task.dueDate) < now && !task.completed) {
        const timeDiff = now.getTime() - new Date(task.dueDate).getTime();
        const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
        
        let urgencyMessage;
        if (hoursDiff < 1) {
          urgencyMessage = "just now";
        } else if (hoursDiff < 24) {
          urgencyMessage = `${hoursDiff} hour${hoursDiff === 1 ? '' : 's'} ago`;
        } else {
          const daysDiff = Math.floor(hoursDiff / 24);
          urgencyMessage = `${daysDiff} day${daysDiff === 1 ? '' : 's'} ago`;
        }
        
        this.notify(task, `Task "${task.title}" is overdue! (Due ${urgencyMessage})`);
      }
    });
  }

  setupRealtimeUpdates(): void {
    supabase
      .channel('tasks')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          const { new: newTask } = payload;
          if (newTask && typeof newTask === 'object' && 'title' in newTask) {
            this.notify(newTask as Task, `Task "${(newTask as Task).title}" was updated`);
          }
        }
      )
      .subscribe();
  }
}

export const taskNotifier = new TaskNotifier();