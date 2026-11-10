import os
from dotenv import load_dotenv

load_dotenv()


def obter_chave_gemini() -> str:
    return os.getenv("GEMINI_API_KEY", "").strip()


def obter_modelo_gemini() -> str:
    return os.getenv("GEMINI_MODELO", "gemini-3.5-flash-lite").strip()


def obter_origens_permitidas() -> list:
    texto = os.getenv("ORIGENS_PERMITIDAS", "*")
    origens = [origem.strip() for origem in texto.split(",")]
    return [origem for origem in origens if origem]
