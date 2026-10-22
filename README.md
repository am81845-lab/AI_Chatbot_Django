# AI_Chatbot_Django
A simple web-based AI chatbot built with Python, Django, HTML, CSS and JavaScript. Users type a message in a clean, responsive chat window, and the Django backend sends the conversation to the OpenAI Responses API and returns the AI’s reply. 
# AI Chatbot — Django + OpenAI

A simple, responsive AI chatbot built with **Python, Django, HTML, CSS and JavaScript**. The browser sends your conversation to a Django backend, which calls the **OpenAI Responses API** and returns the reply. Your API key stays on the server and is never exposed to the browser.

![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![Django](https://img.shields.io/badge/Django-6.1-green)
![OpenAI](https://img.shields.io/badge/OpenAI-Responses%20API-black)

<!-- Add a screenshot of your chatbot here:
![Chatbot screenshot](screenshots/chatbot.png)
-->

## Features

- Clean, responsive chat interface (desktop and mobile)
- AI replies powered by the OpenAI Responses API
- Conversation context: the last 20 messages are sent with each request
- Chat history saved in the browser (`localStorage`) with a **Clear** button
- Enter to send, Shift+Enter for a new line
- "Thinking..." loading indicator and friendly error messages
- CSRF protection and server-side input validation
- API key and settings kept in a `.env` file

## Tech Stack

| Layer     | Technology                                  |
|-----------|---------------------------------------------|
| Backend   | Python, Django                              |
| AI        | OpenAI Python SDK (Responses API)           |
| Frontend  | HTML, CSS, vanilla JavaScript               |
| Config    | python-dotenv                               |
| Database  | SQLite (Django default; no custom models)   |

## Project Structure

```
chatbot_project/
├── chatbot/
│   ├── static/chatbot/
│   │   ├── css/style.css      # Chat UI styles
│   │   └── js/chat.js         # Chat logic, history, API calls
│   ├── templates/chatbot/
│   │   └── index.html         # Chat page
│   ├── views.py               # Home page + /api/chat/ endpoint
│   └── urls.py
├── chatbot_project/
│   ├── settings.py
│   └── urls.py
├── .env.example               # Copy to .env and add your key
├── manage.py
├── requirements.txt
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.10 or newer
- An [OpenAI API key](https://platform.openai.com/api-keys)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/<your-repo>.git
   cd <your-repo>/chatbot_project
   ```

2. **Create and activate a virtual environment**

   Windows:
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```
   macOS / Linux:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**

   Windows:
   ```bash
   copy .env.example .env
   ```
   macOS / Linux:
   ```bash
   cp .env.example .env
   ```

   Then open `.env` and add your values:
   ```env
   OPENAI_API_KEY=your_api_key_here
   OPENAI_MODEL=gpt-6-luna
   DJANGO_SECRET_KEY=change-me
   DEBUG=True
   ```
   Set `OPENAI_MODEL` to any model your account has access to.

5. **Run migrations and start the server**
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

6. Open **http://127.0.0.1:8000/** in your browser.

## How It Works

1. The browser sends the chat history as JSON to `POST /api/chat/`.
2. Django validates the request (only `user` and `assistant` roles, non-empty text, length limits) and keeps the last 20 messages.
3. The server calls the OpenAI Responses API with a system prompt that keeps answers helpful and concise.
4. The reply is returned as JSON and shown in the chat window.

## Configuration

| Variable            | Description                                 | Default        |
|---------------------|---------------------------------------------|----------------|
| `OPENAI_API_KEY`    | Your OpenAI API key (required)              | —              |
| `OPENAI_MODEL`      | Model used for replies                      | `gpt-6-luna`   |
| `DJANGO_SECRET_KEY` | Django secret key                           | dev-only key   |
| `DEBUG`             | Django debug mode (`True` / `False`)        | `True`         |

To change the chatbot's personality, edit `SYSTEM_INSTRUCTIONS` in `chatbot/views.py`.

## Running Tests

```bash
python manage.py test
```

## Security Notes

- **Never commit your `.env` file.** It is already listed in `.gitignore`.
- Never put your API key in HTML, JavaScript, or a public repository.
- Set `DEBUG=False` and use a strong `DJANGO_SECRET_KEY` before deploying.
- API usage may incur charges; check current OpenAI pricing.

## Roadmap

- [ ] Streaming responses
- [ ] Markdown and code-block rendering
- [ ] User accounts with chat history stored in the database
- [ ] Custom bot personas

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

Add a license of your choice (for example, [MIT](https://choosealicense.com/licenses/mit/)) and describe it here.
