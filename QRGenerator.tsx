import React, { useState, useCallback } from 'react';
import QRCode from 'qrcode';
import { Button } from './Button';
import { Input } from './Input';
import { Download, RefreshCw, QrCode, Settings2, ChevronDown, ChevronUp } from 'lucide-react';

export const QRGenerator: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [codeName, setCodeName] = useState<string>('');
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Customization State
  const [fgColor, setFgColor] = useState<string>('#312e81');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [ecc, setEcc] = useState<string>('H');
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const handleGenerate = useCallback(async () => {
    if (!url.trim()) {
      setError('الرجاء إدخال رابط صحيح');
      return;
    }
    setError('');
    setLoading(true);

    try {
      // Generate QR code as a Data URL (PNG)
      const dataUrl = await QRCode.toDataURL(url, {
        width: 400,
        margin: 1,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: ecc as any
      });
      
      // Artificial delay for better UX feel
      setTimeout(() => {
        setQrImage(dataUrl);
        setLoading(false);
      }, 500);

    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء إنشاء الباركود. يرجى المحاولة مرة أخرى.');
      setLoading(false);
    }
  }, [url, fgColor, bgColor, ecc]);

  const handleDownload = useCallback(() => {
    if (!qrImage) return;

    const link = document.createElement('a');
    link.href = qrImage;
    // Use code name for filename if available, otherwise use timestamp
    const filename = codeName.trim() 
      ? `${codeName.trim().replace(/[^a-z0-9\u0600-\u06FF]/gi, '_')}.png` 
      : `qrcode-${Date.now()}.png`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [qrImage, codeName]);

  const handleReset = useCallback(() => {
    setQrImage(null);
    setUrl('');
    setCodeName('');
    setError('');
    // We intentionally do not reset colors/settings so the user can generate multiple codes with the same style
  }, []);

  return (
    <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-center">
        <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm mb-4">
          <QrCode className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">صانع الباركود</h1>
        <p className="text-indigo-100 text-sm">حول روابطك إلى QR Code بسرعة وسهولة</p>
      </div>

      <div className="p-8 space-y-6">
        {!qrImage ? (
          // Input View
          <div className="space-y-6 animate-fadeIn">
            <Input
              label="اسم الكود"
              placeholder="مثال: موقعي الشخصي"
              value={codeName}
              onChange={(e) => setCodeName(e.target.value)}
            />
            <Input
              label="أدخل الرابط"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              error={error}
              onKeyDown={(e) => {
                  if(e.key === 'Enter') handleGenerate();
              }}
            />

            {/* Customization Settings Toggle */}
            <div className="border-t border-gray-100 pt-2">
              <button 
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors py-2"
              >
                <Settings2 className="w-4 h-4" />
                <span>خيارات التصميم والدقة</span>
                {showSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showSettings && (
                <div className="mt-3 space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100 animate-fadeIn">
                  
                  {/* Colors */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">لون الباركود</label>
                      <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200">
                        <input 
                          type="color" 
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
                          className="h-8 w-8 rounded cursor-pointer border-0 p-0"
                          title="اختر لون الباركود"
                        />
                        <span className="text-[10px] text-gray-500 font-mono dir-ltr truncate">{fgColor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">لون الخلفية</label>
                      <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200">
                        <input 
                          type="color" 
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="h-8 w-8 rounded cursor-pointer border-0 p-0"
                          title="اختر لون الخلفية"
                        />
                        <span className="text-[10px] text-gray-500 font-mono dir-ltr truncate">{bgColor}</span>
                      </div>
                    </div>
                  </div>

                  {/* Error Correction */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">دقة تصحيح الخطأ</label>
                    <select 
                      value={ecc}
                      onChange={(e) => setEcc(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                    >
                      <option value="L">منخفض (L) - الأبسط</option>
                      <option value="M">متوسط (M) - متوازن</option>
                      <option value="Q">عالي (Q) - جودة جيدة</option>
                      <option value="H">فائق (H) - الأفضل للطباعة</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <Button 
              onClick={handleGenerate} 
              fullWidth 
              disabled={loading || !url}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="animate-spin w-5 h-5" />
                  جاري الإنشاء...
                </span>
              ) : 'إنشاء الباركود'}
            </Button>
          </div>
        ) : (
          // Result View
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 relative">
              {/* Background preview to ensure transparent backgrounds look right if selected */}
              <div 
                className="p-4 rounded-xl shadow-sm"
                style={{ backgroundColor: bgColor }}
              >
                <img 
                  src={qrImage} 
                  alt="Generated QR Code" 
                  className="w-48 h-48 object-contain"
                />
              </div>
              <div className="mt-4 text-center max-w-full w-full">
                {codeName && (
                  <h3 className="text-lg font-bold text-gray-900 mb-1 truncate px-4">
                    {codeName}
                  </h3>
                )}
                <p className="text-sm text-gray-500 font-medium truncate px-4 dir-ltr">
                  {url}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleDownload} 
                fullWidth 
                className="group"
              >
                <Download className="w-5 h-5 ml-2 group-hover:-translate-y-1 transition-transform" />
                تحميل الباركود
              </Button>
              
              <Button 
                onClick={handleReset} 
                variant="outline" 
                fullWidth
              >
                <RefreshCw className="w-5 h-5 ml-2" />
                إنشاء باركود آخر
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};