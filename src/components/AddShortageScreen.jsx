import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

function AddShortageScreen({ onBack, apiService }) {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('كيلو');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const productUnits = ['كيلو', 'لتر', 'حبة', 'كرتون', 'صندوق', 'كيس', 'علبة', 'درزن'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');
    setLoading(true);

    try {
      await apiService.createShortage({
        product_name: productName,
        quantity: parseFloat(quantity),
        unit: unit,
        notes: notes,
      });
      setMessage('تمت إضافة النقص بنجاح!');
      setMessageType('success');
      setProductName('');
      setQuantity('');
      setNotes('');
    } catch (error) {
      setMessage(error.message || 'فشل إضافة النقص. يرجى المحاولة مرة أخرى.');
      setMessageType('error');
    }
    setLoading(false);
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
          <CardTitle className="text-3xl font-bold text-teal-700">إضافة نقص جديد</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="productName" className="text-right block text-gray-700 text-sm font-bold mb-2">اسم المنتج</Label>
              <Input
                id="productName"
                type="text"
                placeholder="مثال: أرز بسمتي"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity" className="text-right block text-gray-700 text-sm font-bold mb-2">الكمية</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="مثال: 50"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
                />
              </div>
              <div>
                <Label htmlFor="unit" className="text-right block text-gray-700 text-sm font-bold mb-2">الوحدة</Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right">
                    <SelectValue placeholder="اختر وحدة" />
                  </SelectTrigger>
                  <SelectContent>
                    {productUnits.map((u) => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="notes" className="text-right block text-gray-700 text-sm font-bold mb-2">ملاحظات (اختياري)</Label>
              <Input
                id="notes"
                type="text"
                placeholder="مثال: يفضل نوع معين أو تاريخ صلاحية"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
              />
            </div>
            {message && (
              <p className={`text-sm text-center ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
            <Button
              type="submit"
              className="w-full sallaty-primary py-2 rounded-lg text-white font-semibold hover:bg-teal-800 transition duration-200"
              disabled={loading}
            >
              {loading ? 'جاري الإضافة...' : 'إضافة النقص'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddShortageScreen;
