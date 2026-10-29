# AI Chatbot — Django + OpenAI

Simple AI chatbot using Python, Django, HTML, CSS, JavaScript, and the OpenAI Responses API.

## Features
- Responsive chat UI
- OpenAI AI responses
- Conversation context for the current chat
- Enter to send / Shift+Enter for new line
- Clear chat
- Loading indicator
- Mobile-friendly design
- API key stored in `.env`

## Run in VS Code (Windows)
1. Open the `chatbot_project` folder.
2. Create venv: `python -m venv venv`
3. Activate: `venv\Scripts\activate`
4. Install: `pip install -r requirements.txt`
5. Copy `.env.example` to `.env` (`copy .env.example .env`) and add your real OpenAI API key.
6. Run: `python manage.py migrate`
7. Start: `python manage.py runserver`
8. Open http://127.0.0.1:8000/

Never put the API key in HTML, JavaScript, GitHub, or a public repository. API usage may incur charges; check current OpenAI pricing.
