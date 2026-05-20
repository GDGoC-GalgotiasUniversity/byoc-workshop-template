import os
from dotenv import load_dotenv
from langchain_ollama import OllamaLLM
from langchain_openai import ChatOpenAI

load_dotenv()

def get_llm(use_cloud=False):
    if use_cloud:
        # Scale to Gemma 2 9B via OpenRouter for complex tasks
        return ChatOpenAI(
            model_name="google/gemma-2-9b-it",
            openai_api_key=os.getenv("OPENROUTER_API_KEY"),
            openai_api_base="https://openrouter.ai/api/v1",
        )
    # Default: Local Ollama
    return OllamaLLM(model="gemma2:2b")
