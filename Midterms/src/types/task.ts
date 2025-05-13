export interface TaskItem {
  text: string;
  checked: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  type: 'basic' | 'timed' | 'checklist';
  items?: TaskItem[];
}