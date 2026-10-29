import json
import logging
import os

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from openai import OpenAI

logger = logging.getLogger(__name__)

SYSTEM_INSTRUCTIONS = (
    "You are a helpful, friendly AI assistant. Give accurate, practical answers. "
    "Use clear language and concise structure. If the user asks for code, provide "
    "clean code with a short explanation. If you are unsure, say so instead of "
    "inventing facts."
)

MAX_MESSAGES = 20
MAX_MESSAGE_LENGTH = 12000


@ensure_csrf_cookie
def home(request):
    return render(request, "chatbot/index.html")


def clean_messages(messages):
    """Keep only valid user/assistant messages from the last MAX_MESSAGES."""
    cleaned = []
    for message in messages[-MAX_MESSAGES:]:
        role = message.get("role")
        content = message.get("content")
        if role in {"user", "assistant"} and isinstance(content, str) and content.strip():
            cleaned.append({"role": role, "content": content.strip()[:MAX_MESSAGE_LENGTH]})
    return cleaned


@csrf_protect
def chat_api(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST requests are allowed."}, status=405)

    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key or api_key == "your_api_key_here":
        return JsonResponse(
            {"error": "OPENAI_API_KEY is not configured. Add it to your .env file."},
            status=500,
        )

    try:
        body = json.loads(request.body)
        messages = body.get("messages", [])

        if not isinstance(messages, list) or not messages:
            return JsonResponse({"error": "Please provide at least one message."}, status=400)

        cleaned = clean_messages(messages)
        if not cleaned:
            return JsonResponse({"error": "No valid messages were provided."}, status=400)

        client = OpenAI(api_key=api_key)
        response = client.responses.create(
            model=os.getenv("OPENAI_MODEL", "gpt-6-luna"),
            instructions=SYSTEM_INSTRUCTIONS,
            input=cleaned,
        )
        return JsonResponse({"reply": response.output_text})

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON request."}, status=400)
    except Exception:
        logger.exception("OpenAI request failed")
        return JsonResponse(
            {
                "error": (
                    "The AI service could not process your request. "
                    "Check your API key, model, and server terminal."
                )
            },
            status=500,
        )
