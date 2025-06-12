import React, { useState } from 'react';
import axios from 'axios';

const Analytics = () => {
  // const [userInput, setUserInput] = useState('');
  // const [botChoice, setBotChoice] = useState('Ollama Chatbot');
  // const [response, setResponse] = useState('');

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await axios.post<{ response: string }>('http://localhost:8500/chatbot', {
  //       user_input: userInput,
  //       bot_choice: botChoice
  //     });
  //     setResponse(res.data.response);
  //   } catch (error) {
  //     console.error('Error calling chatbot API:', error);
  //     setResponse('Error: Could not get response from chatbot');
  //   }
  // };
  return (
    <div className="w-full min-h-0">
      {/* <h2>Ollama Chatbot</h2>
      <form onSubmit={handleSubmit}>
          <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Nhập câu hỏi của bạn"
          />
          <select value={botChoice} onChange={(e) => setBotChoice(e.target.value)}>
              <option value="Ollama Chatbot">Ollama Chatbot</option>
              <option value="FAISS Bot">FAISS Bot</option>
          </select>
          <button type="submit">Gửi</button>
      </form>
      <div>
        <h3>Phản hồi:</h3>
        <p>{response}</p>
      </div> */}
      {/* <span className="text-2xl font-medium">Phân tích dữ liệu</span> */}
      <div style={{ width: '100%', height: '600px' }}>
        <iframe
          src={`${process.env.CHATBOT_URL}`}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          title="Chatbot hỗ trợ các câu hỏi về bệnh ung thư phổi"
        />
      </div>
    </div>
  );
};

export default Analytics;
