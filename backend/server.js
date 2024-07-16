const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Connected, I'm Express WAS!" });
});

app.post("/api/multiply", (req, res) => {
  const { number } = req.body;
  const result = number * 2;
  res.json({ result });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
