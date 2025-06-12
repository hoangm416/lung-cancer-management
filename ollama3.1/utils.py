from langchain_ollama import OllamaLLM

def get_llm_model(modelname):
    if modelname == "ollama-llama3.1":
      return OllamaLLM(model="llama3.1")
