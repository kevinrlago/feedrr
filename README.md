# Feedrr

Feedrr is a modern RSS feed aggregator and dispatcher that allows you to collect, manage and distribute content from multiple RSS feeds to various messaging platforms.

## Features

- 📱 Multi-platform dispatch support (Telegram, Discord, WhatsApp)
- 🔄 Automated feed syncing and updates
- 👥 Role-based access control (Admin, Validator, Pro User, Basic User)
- ✅ Feed request validation workflow
- 📂 Category organization for feeds
- 📊 Analytics and statistics dashboard

## Technology Stack

- Backend: FastAPI + PostgreSQL
- Frontend: React + Material-UI
- Docker containerization
- JWT authentication

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/feedrr.git
cd feedrr
```

2. Start the application using Docker:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Configuration

Create a config.json file:

```json
{
  "database": {
    "url": "postgresql://postgres:postgres@db:5432/feedrr"
  },
  "telegram": {
    "bot_token": "YOUR_BOT_TOKEN",
    "chat_id": "YOUR_CHAT_ID"
  },
  "discord": {
    "bot_token": "YOUR_BOT_TOKEN"
  },
  "whatsapp": {
    "api_key": "YOUR_API_KEY"
  }
}
```

## User Roles

- **Admin**: Full system access
- **Validator**: Approve/reject feed requests
- **Pro User**: Submit feed requests, manage categories
- **Basic User**: Submit feed requests

## Feed Management

1. Users can request new feeds to be added
2. Validators review and approve/reject requests
3. Approved feeds are automatically synced
4. Content is dispatched to configured platforms

## Development

Run tests:
```bash
pytest tests/ -v
```

Generate test coverage:
```bash
pytest --cov=app tests/
```

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

Copyright (C) 2024 Feedrr

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.