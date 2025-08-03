import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { ChevronRight, Search, XCircle, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Label } from "./ui/label";

function ShortageListScreen({ onBack, apiService, currentUser }) {
  const [shortages, setShortages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShortage, setSelectedShortage] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseLoading, setResponseLoading] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all', 'my_shortages', 'responded_by_me'

  useEffect(() => {
    fetchShortages();
  }, [filterType]);

  const fetchShortages = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (filterType === 'my_shortages') {
        data = await apiService.getMyShortages();
      } else {
        data = await apiService.getShortages();
      }
      setShortages(data.shortages);
    } catch (err) {
      setError(err.message || 'فشل في جلب النواقص');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredShortages = shortages.filter(shortage => {
    const matchesSearch = shortage.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          shortage.store_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'responded_by_me') {
      return matchesSearch && shortage.responses.some(res => res.store_id === currentUser.id);
    }
    return matchesSearch;
  });

  const handleRespondClick = (shortage) => {
    setSelectedShortage(shortage);
    setResponseMessage('');
  };

  const handleSendResponse = async () => {
    if (!responseMessage.trim()) return;

    setResponseLoading(true);
    try {
      await apiService.respondToShortage(selectedShortage.id, { message: responseMessage });
      alert('تم إرسال الرد بنجاح!');
      setSelectedShortage(null);
      fetchShortages(); // Refresh the list
    } catch (err) {
      alert(`فشل إرسال الرد: ${err.message}`);
    } finally {
      setResponseLoading(false);
    }
  };

  const getStatusText = (shortage) => {
    if (shortage.is_fulfilled) {
      return <span className="text-green-600 font-semibold flex items-center"><CheckCircle className="w-4 h-4 ml-1" /> تم التلبية</span>;
    } else if (shortage.responses.length > 0) {
      return <span className="text-blue-600 font-semibold flex items-center"><CheckCircle className="w-4 h-4 ml-1" /> يوجد ردود ({shortage.responses.length})</span>;
    }
    return <span className="text-yellow-600 font-semibold flex items-center"><XCircle className="w-4 h-4 ml-1" /> بانتظار الرد</span>;
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
          <CardTitle className="text-3xl font-bold text-teal-700">قائمة النواقص</CardTitle>
          <CardDescription className="text-gray-600">تصفح النواقص وأرسل ردودك</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Button 
              onClick={() => setFilterType('all')}
              className={`flex-1 ${filterType === 'all' ? 'sallaty-primary' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              جميع النواقص
            </Button>
            <Button 
              onClick={() => setFilterType('my_shortages')}
              className={`flex-1 ${filterType === 'my_shortages' ? 'sallaty-primary' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              نواقص متجري
            </Button>
          </div>
          <div className="relative mb-4">
            <Input
              type="text"
              placeholder="ابحث عن منتج أو متجر..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pr-10 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          {loading && <p className="text-center text-gray-600">جاري التحميل...</p>}
          {error && <p className="text-center text-red-600">خطأ: {error}</p>}

          {!loading && filteredShortages.length === 0 && (
            <p className="text-center text-gray-600">لا توجد نواقص لعرضها.</p>
          )}

          <div className="space-y-4">
            {filteredShortages.map((shortage) => (
              <Card key={shortage.id} className="border-l-4 border-teal-500 sallaty-card card-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-teal-700">{shortage.product_name}</h3>
                    <span className="text-sm text-gray-500">من: {shortage.store_name}</span>
                  </div>
                  <p className="text-gray-700 mb-2">الكمية المطلوبة: {shortage.quantity} {shortage.unit}</p>
                  {shortage.notes && <p className="text-gray-600 text-sm mb-2">ملاحظات: {shortage.notes}</p>}
                  <p className="text-sm mb-2">الحالة: {getStatusText(shortage)}</p>
                  <p className="text-xs text-gray-400">تاريخ الطلب: {new Date(shortage.timestamp).toLocaleString('ar-EG')}</p>
                  
                  {shortage.responses.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <h4 className="text-md font-semibold text-gray-700 mb-2">الردود:</h4>
                      {shortage.responses.map(response => (
                        <div key={response.id} className="bg-gray-100 p-2 rounded-lg mb-2">
                          <p className="text-sm text-gray-800">**{response.store_name}**: {response.message}</p>
                          <p className="text-xs text-gray-500 text-left">{new Date(response.timestamp).toLocaleString('ar-EG')}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {shortage.store_id !== currentUser.id && !shortage.is_fulfilled && (
                    <Button 
                      onClick={() => handleRespondClick(shortage)}
                      className="mt-3 w-full sallaty-secondary py-2 rounded-lg text-white font-semibold hover:bg-orange-600 transition duration-200"
                    >
                      الرد على النقص
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedShortage && (
        <Dialog open={!!selectedShortage} onOpenChange={() => setSelectedShortage(null)}>
          <DialogContent className="rtl">
            <DialogHeader>
              <DialogTitle className="text-right">الرد على نقص: {selectedShortage.product_name}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="responseMessage" className="text-right block text-gray-700 text-sm font-bold mb-2">رسالتك:</Label>
              <Input
                id="responseMessage"
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="اكتب ردك هنا..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
              />
            </div>
            <DialogFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSelectedShortage(null)}>إلغاء</Button>
              <Button onClick={handleSendResponse} disabled={responseLoading || !responseMessage.trim()} className="sallaty-primary">
                {responseLoading ? 'جاري الإرسال...' : 'إرسال الرد'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default ShortageListScreen;
