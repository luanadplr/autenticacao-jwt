import express from "express";
import cors from "cors";
import "dotenv/config";
import routes from "./src/routes/routes.js";
import { poolDB } from "./src/data/db.js";

const PORT = process.env.PORT || 3000;

const server = express();
server.use(express.json());
server.use(cors());
server.use("/users", routes);

server.get("/", (req, res) => {
  res.json({ message: "is working..." });
});

async function start() {
  try {
    const connection = await poolDB.getConnection();
    console.log("🟢 SUCCESSFULL CONNECTION");
    connection.release();
    server.listen(PORT, () => {
      console.log("SERVER RUNNING IN http://localhost:" + PORT);
    });
  } catch (error) {
    console.log("🔴 DATABASE ERROR...\n", error);
    process.exit(1);
  }
}

start();
