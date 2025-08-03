import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Bell, PlusCircle, List, LogOut } from "lucide-react";

function MainScreen({ user, onNavigate, onLogout, apiService }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await apiService.getUnreadCount();
        setUnreadCount(response.count);
      } catch (error) {
        console.error("Failed to fetch unread notifications count:", error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // تحديث كل 30 ثانية
    return () => clearInterval(interval);
  }, [apiService]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center rtl">
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-4xl font-bold text-teal-700 mb-2">أهلاً بك، {user?.username}!</h1>
        <p className="text-gray-600">لوحة التحكم الرئيسية لمتجرك</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-md">
        <Card className="sallaty-card card-shadow cursor-pointer hover:shadow-lg transition-shadow duration-300" onClick={() => onNavigate("add-shortage")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-teal-700">إضافة نقص جديد</CardTitle>
            <PlusCircle className="h-8 w-8 text-teal-600" />
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600">أضف منتجًا ناقصًا لمتجرك ليراه الموردون.</CardDescription>
          </CardContent>
        </Card>

        <Card className="sallaty-card card-shadow cursor-pointer hover:shadow-lg transition-shadow duration-300" onClick={() => onNavigate("shortage-list")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-teal-700">قائمة النواقص</CardTitle>
            <List className="h-8 w-8 text-teal-600" />
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600">تصفح جميع النواقص الحالية وقم بالرد عليها.</CardDescription>
          </CardContent>
        </Card>

        <Card className="sallaty-card card-shadow cursor-pointer hover:shadow-lg transition-shadow duration-300" onClick={() => onNavigate("notifications")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-teal-700">الإشعارات</CardTitle>
            <div className="relative">
              <Bell className="h-8 w-8 text-teal-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600">اطلع على آخر التحديثات والردود على نواقصك.</CardDescription>
          </CardContent>
        </Card>

        <Card className="sallaty-card card-shadow cursor-pointer hover:shadow-lg transition-shadow duration-300" onClick={onLogout}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-red-600">تسجيل الخروج</CardTitle>
            <LogOut className="h-8 w-8 text-red-500" />
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600">الخروج من حساب متجرك.</CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MainScreen;
