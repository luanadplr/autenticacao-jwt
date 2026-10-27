import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT;

const server = express();
server.use(express.json());
server.use(cors());

server.listen(PORT, () => {
  console.log("SERVER RUNNING IN http://localhost:" + PORT);
});
