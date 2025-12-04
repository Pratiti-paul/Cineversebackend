import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import moviesRoutes from "./routes/moviesRoutes.js";
import userRoutes from "./routes/userRoutes.js";


const app = express();
app.use(cors());

app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/movies", moviesRoutes);  
app.use("/api/user", userRoutes); 

app.get("/", (req, res) => res.send("CineVerse API is running..."));

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);



