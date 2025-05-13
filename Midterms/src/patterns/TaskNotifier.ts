import type { Task } from '../types/task';

type Subscriber = (task: Task, message: string) => void;

class TaskNotifier {
  private subscribers: Subscriber[] = [];
  private notifiedTaskIds: Set<string> = new Set(); // Track which tasks have been notified
  
  subscribe(subscriber: Subscriber): void {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: Subscriber): void {
    this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
  }

  notify(task: Task, message: string): void {
    this.subscribers.forEach((subscriber) => subscriber(task, message));
  }
  
  // Reset notification tracking for a task after some time
  private resetNotificationAfter(taskId: string, timeMs = 300000) { // 5 minutes default
    setTimeout(() => {
      this.notifiedTaskIds.delete(taskId);
    }, timeMs);
  }

  checkForOverdueTasks(tasks: Task[]): void {
    const now = new Date();
    tasks.forEach((task) => {
      if (
        task.dueDate && 
        new Date(task.dueDate) < now && 
        !task.completed &&
        !this.notifiedTaskIds.has(task.id) // Only notify if not already notified
      ) {
        this.notify(task, `Task "${task.title}" is overdue!`);
        this.notifiedTaskIds.add(task.id);
        this.resetNotificationAfter(task.id);
      }
    });
  }
}

export const taskNotifier = new TaskNotifier();