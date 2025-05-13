import React, { useState, useEffect } from "react";
import type { Task } from "../types/task";
import { taskNotifier } from "../patterns/TaskNotifier";

const Notification: React.FC = () => {
  const [notifications, setNotifications] = useState<
    { task: Task; message: string }[]
  >([]);

  useEffect(() => {
    const handleNotification = (task: Task, message: string) => {
      setNotifications((prev) => [...prev, { task, message }]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.task.id !== task.id));
      }, 5000);
    };

    taskNotifier.subscribe(handleNotification);
    return () => {
      taskNotifier.unsubscribe(handleNotification);
    };
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {notifications.map((notification, index) => (
        <div
          key={`${notification.task.id}-${index}`}
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg"
          role="alert"
        >
          <p className="font-bold">Alert</p>
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
};

export default Notification;
