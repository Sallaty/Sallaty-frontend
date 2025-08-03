import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ChevronRight, MailOpen } from "lucide-react";

function NotificationsScreen({ onBack, apiService }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getNotifications();
      setNotifications(data.notifications);
    } catch (err) {
      setError(err.message || 'فشل في جلب الإشعارات');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await apiService.markNotificationRead(notificationId);
      fetchNotifications(); // Refresh notifications after marking as read
    } catch (err) {
      alert(`فشل تمييز الإشعار كمقروء: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center rtl">
      <div className="w-full max-w-md mb-6">
        <Button variant="ghost" onClick={onBack} className="text-teal-600 hover:text-teal-800 flex items-center">
          <ChevronRight className="h-5 w-5 ml-1" />
          العودة
        </Button>
      </div>

      <Card className="w-full max-w-md sallaty-card card-shadow">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-teal-700">الإشعارات</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-center text-gray-600">جاري التحميل...</p>}
          {error && <p className="text-center text-red-600">خطأ: {error}</p>}

          {!loading && notifications.length === 0 && (
            <p className="text-center text-gray-600">لا توجد إشعارات حاليًا.</p>
          )}

          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`border-l-4 ${notification.is_read ? 'border-gray-300' : 'border-orange-500'} sallaty-card card-shadow`}
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className={`text-lg font-semibold ${notification.is_read ? 'text-gray-600' : 'text-teal-700'}`}>
                      {notification.message}
                    </p>
                    <p className="text-sm text-gray-500">
                      تاريخ: {new Date(notification.timestamp).toLocaleString('ar-EG')}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => markAsRead(notification.id)}
                      className="text-teal-600 hover:text-teal-800"
                    >
                      <MailOpen className="h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default NotificationsScreen;
