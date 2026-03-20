import { useEffect, useState } from "react";

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Kiểm tra nếu đã cài đặt rồi
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log("Sự kiện beforeinstallprompt đã được bắt!");
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []); // Chỉ chạy 1 lần khi mount

  const handleInstall = async () => {
    if (!deferredPrompt) {
      alert("Trình duyệt chưa sẵn sàng hoặc ứng dụng không hỗ trợ cài đặt tự động.");
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstalled(true);
    }
  };

  if (isInstalled) return null; // Ẩn nút nếu đã cài đặt

  return (
    <button
      onClick={handleInstall}
      className={`px-4 py-2 rounded ${!deferredPrompt ? 'bg-gray-400' : 'bg-blue-600 text-white'}`}
    >
      Tải ứng dụng
    </button>
  );
}