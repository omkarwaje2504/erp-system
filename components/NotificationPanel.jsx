"use client";

import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const user = JSON.parse(userData);
      setUserId(user.id);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      setInterval(() => {
        fetchNotifications(userId);
      }, 20000);
    }
  }, [userId]);

  const fetchNotifications = async (uid) => {
    try {
      const res = await fetch(`/api/notifications?userId=${uid}`);
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await fetch(`/api/notifications?id=${id}`, {
        method: "DELETE",
      });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className="p-4 hover:bg-gray-50 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{notification.title}</h3>
              <p className="text-sm text-gray-600">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDeleteNotification(notification.id)}
                className="text-red-500 hover:bg-red-50 p-2 rounded-full"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-sm text-gray-500 py-4">
          No notifications found.
        </div>
      )}
    </>
  );
};

export default NotificationPanel;
