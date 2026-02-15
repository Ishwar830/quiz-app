import "dotenv/config";

const API_URL = process.env.API_URL;
const CLIENT_URL = process.env.CLIENT_URL;
const ROOM_CODE = process.env.ROOM_CODE;

// keep it low
const NUM_BOTS = 20;

export const config = {
  ROOM_CODE,
  API_URL,
  CLIENT_URL,
  NUM_BOTS,
};
