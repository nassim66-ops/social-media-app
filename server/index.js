import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
// import User from "./models/User.js";
// import Post from "./models/Post.js";
// import { users, posts } from "./data/index.js";

/* CONFIGURATIONS */
// Set up server and middleware:

// Get the absolute file path of the current module's file.
const __filename = fileURLToPath(import.meta.url);

// Get the absolute directory path containing the current module's file.
const __dirname = path.dirname(__filename);

// Configure environment variables using 'dotenv'.
dotenv.config();

// Create an Express.js app instance.
const app = express();

// Parse incoming JSON data and add it to the request object.
app.use(express.json());

// Apply security measures with the 'helmet' middleware.
app.use(helmet());

// Set Cross-Origin Resource Policy for added security.
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Set up logging of HTTP requests using 'morgan'.
app.use(morgan("common"));

// Parse incoming JSON data with a size limit of 30mb.
app.use(bodyParser.json({ limit: "30mb", extended: true }));

// Parse incoming URL-encoded data with a size limit of 30mb.
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Enable Cross-Origin Resource Sharing (CORS) for the Express app.
app.use(cors());

// Serve static assets from the 'public/assets' directory.
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
