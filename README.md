# Feedrr

Feed management and notification system built with FastAPI and React.

![Dashboard Screenshot](docs/images/dashboard.png)

## Features

- 🔄 RSS/Atom Feed Management
- 🔍 Content Filtering
- �� Multi-platform Notifications
  - Telegram
  - Discord
  - Email
  - WhatsApp
- 🔐 API Key Authentication
- 🎯 Magic Link Login
- 📊 Analytics Dashboard

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

## Test Coverage

```bash
Coverage Summary:
- Backend: 90%+ coverage
- Frontend: 90%+ coverage
- E2E Tests: All critical paths covered
```

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

Copyright (C) 2024 Feedrr

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.