import express from "express";

const app = express();
app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "edge-ai-bdc",
    status: "running",
    time: new Date().toISOString()
  });
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/lead", (req, res) => {
  console.log("NEW LEAD RECEIVED:", req.body);
  res.json({ ok: true });
});

app.listen(3007, () => {
  console.log("Server running on port 3007");
});


