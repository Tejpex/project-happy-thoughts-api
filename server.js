import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happy-thoughts"
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

// Defines the port the app will run on.
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

//Schemas and models
const Thought = mongoose.model("Thought", {
  message: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date, 
    default: () => new Date()
  } 
})

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!")
})

app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20)
    res.json(thoughts)
  } catch (err) {
    res.status(400).json({ message: "Something went wrong.", error: err.errors })
  }
})

app.post("/thoughts", async (req, res) => {
  try {
    const thought = new Thought({message: req.body.message})
    await thought.save()
    res.status(201).json(thought)
  } catch (err) {
    res.status(400).json({message: "Could not save thought.", error: err.errors})
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
