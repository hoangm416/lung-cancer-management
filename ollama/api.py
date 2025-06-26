from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import chat_handler, find_answer

app = Flask(__name__)
CORS(app)

@app.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.get_json()
    user_input = data.get('user_input')
    bot_choice = data.get('bot_choice')

    if bot_choice == 'Ollama Chatbot':
        bot_response = chat_handler(user_input)
        return jsonify({'response': bot_response})
    elif bot_choice == 'FAISS Bot':
        faiss_answer = find_answer(user_input)
        if faiss_answer:
            return jsonify({'response': faiss_answer})
        else:
            return jsonify({'response': "Sorry, I couldn't find an answer."})
    else:
        return jsonify({'error': 'Invalid bot choice'}), 400

if __name__ == '__main__':
    app.run(port=8500)