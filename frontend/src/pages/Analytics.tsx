import React, { useState, useEffect } from 'react';

const ChatbotComponent = () => {
  const chatbotUrl = import.meta.env.VITE_CHATBOT_URL as string;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if CHATBOT_URL is defined
    if (!chatbotUrl) {
      setError('URL Chatbot chưa được cấu hình.');
      return;
    }

    // Test URL availability
    const testUrl = async () => {
      try {
        // Make a HEAD request to check if URL is reachable
        const response = await fetch(chatbotUrl, { 
          method: 'HEAD',
          mode: 'no-cors' // Use no-cors to handle cross-origin issues
        });
        
        if (!response.ok && response.type !== 'opaque') {
          throw new Error('Không thể truy cập Chatbot');
        }
      } catch (err) {
        setError('Không thể truy cập chatbot. Vui lòng kiểm tra kết nối hoặc thử lại sau.');
      }
    };

    testUrl();
  }, []);

  return (
    <div className="w-full min-h-0">
      <div style={{ width: '100%', height: '600px' }}>
        {error ? (
          <div className="flex items-center justify-center h-full bg-red-50 border border-destructive rounded">
            <div className="text-destructive text-center p-4">
              <p className="font-medium text-2xl">Lỗi tải chatbot</p>
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <iframe
            src={chatbotUrl}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            title="Chatbot hỗ trợ các câu hỏi về bệnh ung thư phổi"
            onError={() => setError("Không thể tải chatbot. Vui lòng thử lại sau.")}
          />
        )}
      </div>
    </div>
  );
};

export default ChatbotComponent;