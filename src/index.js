import express from "express";
import dotenv from "dotenv";
import router from "./routes/index.js";
import { supabase } from "./lib/supabase.js";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/ping", async (req, res) => {
  const { data, error } = await supabase.from("events").select("*").limit(1);
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

app.use("/v1", router);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
