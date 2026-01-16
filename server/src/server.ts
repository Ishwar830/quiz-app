import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});

server.on("error", (err) => {
  console.error("Server Error: ", err);
});
