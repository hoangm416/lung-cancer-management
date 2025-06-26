import streamlit as st
from chatbot import chat_handler, find_answer  

st.title("Ollama Chatbot :robot_face:")

# Khởi tạo lịch sử chat
if "messages" not in st.session_state:
    st.session_state.messages = []

# Hiển thị lịch sử chat khi tải lại trang
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Nhận câu hỏi từ người dùng
if prompt := st.chat_input("Hi, enter your question"):
    # Lưu và hiển thị tin nhắn người dùng
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
        st.session_state.messages.append({"role": "assistant", "content": bot_response})
        with st.chat_message("assistant"):
            st.markdown(bot_response)

    elif bot_choice == 'FAISS Bot':
        
        faiss_answer = find_answer(prompt)
        if faiss_answer:
            st.session_state.messages.append({"role": "assistant", "content": faiss_answer})
            with st.chat_message("assistant"):
                st.write(faiss_answer)
        else:
            # Nếu không có câu trả lời từ FAISS, hiển thị thông báo lỗi
            st.session_state.messages.append({"role": "assistant", "content": "Sorry, I couldn't find an answer."})
            with st.chat_message("assistant"):
                st.write("Sorry, I couldn't find an answer.")
        
