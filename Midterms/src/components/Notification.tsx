import type React from "react";
import { useState, useEffect } from "react";
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
    <div className="fixed top-4 right-4 space-y-3 z-50">
      {notifications.map((notification, index) => (
        <div
          key={`${notification.task.id}-${index}`}
          className="bg-[#EDF1D6] border-l-4 border-[#609966] text-[#40513B] p-4 rounded-lg shadow-lg animate-slideIn"
          role="alert"
          style={{
            animation: "slideIn 0.3s ease-out forwards",
          }}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#609966]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="font-bold">Task Reminder</p>
              <p className="text-sm">{notification.message}</p>
            </div>
          </div>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Notification;
