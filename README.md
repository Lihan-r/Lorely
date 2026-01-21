# Lorely

**Plan your world. Write your story.**

Lorely is a calm workspace for writers who build worlds. Connect your worldbuilding notes, write with context, and never lose your lore again.

## Project Structure

```
lorely/
├── backend/          # Spring Boot API (Java 17+)
├── frontend/         # Next.js 14 web app (TypeScript)
└── README.md
```

## Features

- **Web View** - Visualize how all your pages connect in an interactive graph
- **Write Drawer** - Distraction-free writing space
- **@Mentions** - Reference any character, place, or item instantly
- **Flexible Pages** - Create any type of content: characters, locations, items, factions

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Java** 17+
- **Maven** 3.8+
- **PostgreSQL** 15+

### Database Setup

```sql
CREATE DATABASE lorely;
```

### Backend

```bash
cd backend

# Set environment variables (or use application-dev.yml)
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=lorely
export DB_USER=your_username
export DB_PASSWORD=your_password
export JWT_SECRET=your-secret-key-min-32-characters

# Run
mvn spring-boot:run
```

The API runs at `http://localhost:8080`

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The app runs at `http://localhost:3000`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get tokens |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout (invalidate tokens) |
| GET | `/api/me` | Get current user |

## Tech Stack

**Backend:**
- Spring Boot 3.2
- Spring Security + JWT
- PostgreSQL + Flyway
- JPA/Hibernate

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS

## License

MIT
