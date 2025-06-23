from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from utils import get_llm_model
import faiss
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer

# Khởi tạo mô hình Ollama
model = get_llm_model("ollama-llama3.1")

# Định nghĩa template trả lời chatbot
template ="""
You are now set up as a consultant specializing in lung cancer. You provide information on symptoms, treatment options, diet, or any other aspect of the disease. Answer the user question below be concise and don't make up answers if you don't have sufficient information
Here is the chat history : {context}
User question : {user_q}
"""
prompt_template = ChatPromptTemplate.from_template(template)

# Tạo DataFrame từ dữ liệu
df = pd.read_csv('/ĐATN/ollama3.1/lungcancer.csv')

# Mã hóa các câu văn thành embeddings
text = df['Text']
encoder = SentenceTransformer("paraphrase-mpnet-base-v2")
embeddings = encoder.encode(text)

# Xây dựng chỉ mục FAISS
vector_dimensions = embeddings.shape[1]
index = faiss.IndexFlatL2(vector_dimensions)
faiss.normalize_L2(embeddings)
index.add(embeddings)

context = []

def chat_function(user_input: str, context: str) -> str:
    chain = prompt_template | model
    bot_response = chain.invoke({"user_q": user_input, "context": context})
    return bot_response

def chat_handler(user_input):
    context_str = "\n".join(c for c in context)
    bot_response = chat_function(user_input, context_str)
    context.append(f"user : {user_input}")
    context.append(f"bot : {bot_response}")
    return bot_response

def find_answer(user_input: str):
    # Mã hóa câu hỏi người dùng thành vector
    search_vector = encoder.encode([user_input])

    # Chuyển search_vector thành mảng NumPy (Đảm bảo đây là mảng 2 chiều)
    new_vector = np.array(search_vector)

    # Đảm bảo new_vector có kích thước (1, chiều vector), tức là một mảng 2 chiều
    if new_vector.ndim == 1:
        new_vector = new_vector.reshape(1, -1)

    # Chuẩn hóa vector tìm kiếm
    faiss.normalize_L2(new_vector)

    # Tìm kiếm trong FAISS để lấy 4 câu trả lời gần nhất
    distances, ann = index.search(new_vector, k=4)

    # Lấy kết quả từ DataFrame
    result = pd.DataFrame({'distances': distances[0], 'ann': ann[0]})

    # Hợp nhất kết quả tìm kiếm với DataFrame để lấy câu trả lời từ DataFrame
    df_merged = pd.merge(result, df, left_on='ann', right_index=True)

    return df_merged['Answer'].iloc[0].strip()  # Lấy câu trả lời tương tự nhất

if __name__ == "__main__":
    print("Welcome to allama bot, press 'Q' to exit!")
    while True:
        user_input = input("Enter your question: ")
        if user_input.lower() == 'q':
            print("bye")
            break

        # Trả lời từ Ollama
        bot_response = chat_handler(user_input)
        print("Chatbot:", bot_response)

        # Tìm câu trả lời gần nhất từ FAISS
        faiss_answer = find_answer(user_input)
        print("FAISS Bot:", faiss_answer)