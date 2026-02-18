# Quizzy

[Live Preview](https://quiz-app-zw92.onrender.com/)

A real-time multiplayer quiz platform featuring AI-generated questions and a custom quiz builder. Play with friends, track your history, and challenge yourself.

![App Screenshot](/screenshots/spectator_mode.png)

## Features

* **Real-time Multiplayer:** Live gameplay synchronization.
* **AI-Powered:** Generate quizzes instantly on any topic using AI.
* **Custom Builder:** Intuitive interface to create and manage your own question sets.
* **Persistent History:** Track past games and scores.
* **Responsive Design:** Optimized for mobile and desktop play.

## Tech Stack

* **Language:** Typescript
* **Frontend:** React, Tailwind CSS, Tanstack Router, Zustand
* **Backend:** Node.js, Express, Drizzle-ORM
* **Database:** PostgreSQL, Redis
* **Real-time:** Socket.io
* **AI:** Gemini API
* **Testing:** Vitest
* **Development:** Git, GitHub, Docker

## Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/Ishwar830/quiz-app.git
    cd quiz-app
    ```

2. **Install dependencies**
    This project contains both client and server. Use the helper script to install dependencies for both:

    ```bash
    npm run install-all
    ```

3. **Local Postgres and Redis Setup**
    *If you have redis and postgres running on your machine skip these instructions.*
    Make sure to have docker installed and running. Then:

    ```bash
    cd server
    docker compose up
    ```

    This will start postgres and redis containers.

    To remove containers

    ```bash
    docker compose down
    ```

4. **Environment Setup**
    Create a `.env.local` file in the server directory. Check the `.env.example` file in server directory.

## Usage

Start the development server:

```bash
npm run dev
```

The application will be available at <http://localhost:3000> (or your specific port).

## User Simulation

```bash
cd simulation
```

Then follow instructions in the `README.md` file there.
