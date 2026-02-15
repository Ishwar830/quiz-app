import { faker } from "@faker-js/faker";
import { config } from "./config.js";
import fs from "node:fs";

// Generate data once and use for signup and simulation

const { NUM_BOTS } = config;

const bots = [];

for (let i = 0; i < NUM_BOTS; ++i) {
  const name = faker.person.firstName();
  const email = `${name}@email.com`;
  const password = "password123";

  bots.push({ name, email, password });
}

function saveToFile() {
  const data = JSON.stringify(bots, null, 2);

  try {
    fs.writeFileSync("bots.json", data);
    console.log("File written successfully");
  } catch (err) {
    console.error("Error writing file:", err);
  }
}

saveToFile();
