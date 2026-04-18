const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// CONNECT DATABASE (paste your MongoDB link)
mongoose.connect("PASTE_MONGODB_LINK_HERE")
.then(() => console.log("Database connected"))
.catch(err => console.log(err));

// Song model
const SongSchema = new mongoose.Schema({
  title: String,
  artist: String,
  album: String,
  audioUrl: String,
  createdAt: { type: Date, default: Date.now }
});

const Song = mongoose.model("Song", SongSchema);

// Multer setup (file uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Upload song API
app.post("/songs/upload", upload.single("song"), async (req, res) => {
  const newSong = new Song({
    title: req.body.title,
    artist: req.body.artist,
    album: req.body.album,
    audioUrl: req.file.path
  });

  await newSong.save();
  res.json({ message: "Song uploaded!" });
});

// Get songs API
app.get("/songs", async (req, res) => {
  const songs = await Song.find().sort({ createdAt: -1 });
  res.json(songs);
});

app.listen(3000, () => console.log("Server running"));
