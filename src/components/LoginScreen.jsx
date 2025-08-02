import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await onLogin(username, password);
    if (!result.success) {
      setError(result.message || 'فشل تسجيل الدخول. يرجى التحقق من اسم المستخدم وكلمة المرور.');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md rtl">
        <CardHeader className="text-center">
          <img src="/sallaty-logo.jpeg" alt="Sallaty Logo" className="mx-auto h-24 w-auto mb-4" />
          <CardTitle className="text-3xl font-bold text-teal-700">تسجيل الدخول</CardTitle>
          <CardDescription className="text-gray-600">أدخل بيانات متجرك لتسجيل الدخول</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-right block text-gray-700 text-sm font-bold mb-2">اسم المستخدم (اسم المتجر)</Label>
              <Input
                id="username"
                type="text"
                placeholder="اسم المتجر"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-right block text-gray-700 text-sm font-bold mb-2">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button
              type="submit"
              className="w-full sallaty-primary py-2 rounded-lg text-white font-semibold hover:bg-teal-800 transition duration-200"
              disabled={loading}
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginScreen;
