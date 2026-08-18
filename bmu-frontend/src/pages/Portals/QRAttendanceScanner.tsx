import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { Camera, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { useAuth } from '../../contexts/useAuth';
import { apiClient } from '../../services/api';

export const QRAttendanceScanner = () => {
  const { isAuthenticated, user } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const startScanning = async () => {
    setResult(null);
    setScanning(true);
    try {
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          await scanner.stop();
          setScanning(false);
          const token = decodedText.split('/').pop() || decodedText;
          try {
            const res = await apiClient.post(`/auth/attendance/scan/${token}`);
            setResult({ success: true, message: res.data.message || 'Attendance recorded successfully!' });
          } catch (err) {
            const e = err as { response?: { data?: { error?: string; detail?: string } } };
            setResult({ success: false, message: e.response?.data?.error || e.response?.data?.detail || 'Failed to record attendance' });
          }
        },
        () => {}
      );
    } catch {
      setScanning(false);
      setResult({ success: false, message: 'Camera access denied or not available' });
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop().catch(() => {});
      scannerRef.current = null;
    }
    setScanning(false);
  };

  if (!isAuthenticated || user?.role !== 'student') {
    return <Navigate to="/portals" replace />;
  }

  return (
    <>
      <Helmet><title>QR Attendance | Bayelsa Medical University</title></Helmet>
      <div>
          <div className="max-w-md mx-auto">
            <div className="bg-white p-6 shadow-sm border border-gray-100 text-center">
              <div ref={containerRef}>
                <div id="qr-reader" className="mx-auto" style={{ maxWidth: 300 }} />
              </div>

              {!scanning && !result && (
                <button onClick={startScanning} className="mt-4 px-6 py-3 bg-[#1E1E1E] text-white font-medium hover:bg-[#1E1E1E]/90 transition flex items-center gap-2 mx-auto">
                  <Camera className="w-5 h-5" /> Start Scanning
                </button>
              )}

              {scanning && (
                <button onClick={stopScanning} className="mt-4 px-6 py-3 bg-red-600 text-white font-medium hover:bg-red-700 transition flex items-center gap-2 mx-auto">
                  <X className="w-5 h-5" /> Stop Scanner
                </button>
              )}

              {result && (
                <div className={`mt-6 p-4 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
                  <div className="flex items-center gap-2 mb-1">
                    {result.success ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
                    <span className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                      {result.success ? 'Success' : 'Error'}
                    </span>
                  </div>
                  <p className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>{result.message}</p>
                  <button onClick={() => setResult(null)} className="mt-3 text-sm text-[#1E1E1E] underline">
                    Scan Again
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 bg-white p-4 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm mb-2">Instructions</h3>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Click "Start Scanning" to activate your camera</li>
                <li>• Point the camera at the QR code displayed by your lecturer</li>
                <li>• Wait for confirmation that attendance has been recorded</li>
                <li>• You can scan multiple sessions in a day</li>
              </ul>
            </div>
          </div>
      </div>
    </>
  );
};
