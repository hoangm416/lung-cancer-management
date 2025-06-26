import streamlit as st
from chatbot import chat_handler, find_answer  
from pymongo import MongoClient
from datetime import datetime

# Thiết lập kết nối đến MongoDB
client = MongoClient('mongodb+srv://hoangasphalt89:Hgmo03770@cluster0.4aur1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
db = client['chatbot_db']
chat_collection = db['chat_history']

st.title("Ollama Chatbot :robot_face:")

# Tải lịch sử chat từ MongoDB
if "messages" not in st.session_state:
    st.session_state.messages = []
    for msg in chat_collection.find({"role": {"$exists": True}, "content": {"$exists": True}}).sort("timestamp", 1):
        st.session_state.messages.append({"role": msg["role"], "content": msg["content"]})

# Hiển thị lịch sử chat khi tải lại trang
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Nhận câu hỏi từ người dùng
if prompt := st.chat_input("Hi, enter your question"):
    # Lưu tin nhắn người dùng vào MongoDB và hiển thị
    chat_collection.insert_one({"role": "user", "content": prompt, "timestamp": datetime.now()})
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    # (Ollama hoặc FAISS)
    bot_choice = st.radio(
        "Choose the bot to get the answer from:",
        ('Ollama Chatbot', 'FAISS Bot')
    )

    if bot_choice == 'Ollama Chatbot':
        bot_response = chat_handler(prompt)
        chat_collection.insert_one({"role": "assistant", "content": bot_response, "timestamp": datetime.now()})
        st.session_state.messages.append({"role": "assistant", "content": bot_response})
        with st.chat_message("assistant"):
            st.markdown(bot_response)

    elif bot_choice == 'FAISS Bot':
        faiss_answer = find_answer(prompt)
        if faiss_answer:
            chat_collection.insert_one({"role": "assistant", "content": faiss_answer, "timestamp": datetime.now()})
            st.session_state.messages.append({"role": "assistant", "content": faiss_answer})
            with st.chat_message("assistant"):
                st.write(faiss_answer)
        else:
            error_msg = "Sorry, I couldn't find an answer."
            chat_collection.insert_one({"role": "assistant", "content": error_msg, "timestamp": datetime.now()})
            st.session_state.messages.append({"role": "assistant", "content": error_msg})
            with st.chat_message("assistant"):
                st.write(error_msg)