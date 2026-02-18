import { config } from "./config.js";
import fs from "node:fs";

const { NUM_BOTS, API_URL, CLIENT_URL } = config;

class BotSignUp {
  constructor(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  async signup() {
    try {
      const response = await fetch(`${API_URL}/api/auth/sign-up/email`, {
        method: "POST",
        headers: {
          Origin: CLIENT_URL,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: this.name,
          email: this.email,
          password: this.password,
        }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(`${this.name} failed to sign up`);
      console.log(error);
    }
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
    const bot = new BotSignUp(i, name, email, password);
    bot.signup();
    await new Promise((r) => setTimeout(r, 500));
  }
})();
