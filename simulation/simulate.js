import "dotenv/config";
import fs from "node:fs";
import axios from "axios";
import io from "socket.io-client";
import { config } from "./config.js";

const { ROOM_CODE, API_URL, CLIENT_URL, NUM_BOTS } = config;

if (!ROOM_CODE) {
  console.error("ROOM_CODE is required");
  process.exit(1);
}

class BotPlayer {
  constructor(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.cookies = null;
    this.user = null;
    this.socket = null;
  }

  async start() {
    try {
      console.log(`[${this.name}] Starting sequence...`);

      // Login
      await this.login();

      // Join Room
      await this.joinRoom();

      // Socket Connection
      this.connectSocket();
    } catch (error) {
      console.error(`[${this.name}] Failed:`, error.message);
      if (error.response)
        console.error("Server response:", error.response.data);
    }
  }

  // --- Login ---
  async login() {
    const response = await axios.post(
      `${API_URL}/api/auth/sign-in/email`,
      {
        email: this.email,
        password: this.password,
      },
      {
        headers: {
          Origin: CLIENT_URL,
        },
      },
    );

    const rawCookies = response.headers["set-cookie"];

    if (!rawCookies) {
      throw new Error("No cookies received from login!");
    }

    this.cookies = rawCookies;
    this.user = response.data.user;

    console.log(`[${this.email}] Logged in.`);
  }

  // --- Join Room ---
  async joinRoom() {
    await axios.post(
      `${API_URL}/api/rooms/join/${ROOM_CODE}?role=PLAYER`,
      {},
      {
        headers: {
          Origin: CLIENT_URL,
          Cookie: this.cookies,
        },
      },
    );

    console.log(`[${this.name}] Joined Room ${ROOM_CODE}`);
  }

  // --- Connect Socket ---
  connectSocket() {
    // Socket.io Node client doesn't use browsers, so we pass cookies in headers
    this.socket = io(API_URL);
    this.socket.auth = { userId: this.user.id };

    this.socket.on("connect", () => {
      console.log(`[${this.name}] Socket Connected! ID: ${this.socket.id}`);
    });

    this.socket.on("connect_error", (err) => {
      console.log(`[${this.name}] Connection Error: ${err.message}`);
    });

    this.socket.emit("room:join", ROOM_CODE);
    // --- GAMEPLAY LOGIC ---
    this.socket.on("question:update", (data) => {
      const thinkingTime = Math.floor(Math.random() * 3000) + 1000;
      console.log(`[${this.name}] Thinking...`);

      setTimeout(() => {
        this.submitAnswer(data);
      }, thinkingTime);
    });

    this.socket.on("quiz:end", () => {
      this.socket.disconnect();
    });
  }

  submitAnswer(question) {
    const choices = question.choices;
    const pickedChoice = choices[Math.floor(Math.random() * 4)];
    this.socket.emit(
      "question:submit",
      {
        questionId: question.id,
        choiceId: pickedChoice.id,
      },
      (res) => {
        if (res.success) {
          console.log(res);
          console.log(`[${this.name}] Answered: ${pickedChoice.text}`);
        }
      },
    );
  }
}

let bots = [];

function populateBotsFromFile() {
  const data = fs.readFileSync("bots.json");
  bots = JSON.parse(data);
}

populateBotsFromFile();

// --- RUNNER ---
(async () => {
  for (let i = 0; i < NUM_BOTS; i++) {
    const { name, email, password } = bots[i];
    const bot = new BotPlayer(i, name, email, password);
    bot.start();
    await new Promise((r) => setTimeout(r, 500));
  }
})();
