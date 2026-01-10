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
app.post("/lead", express.json(), (req, res) => {
  const secret = req.headers["x-edge-secret"];

  if (!secret || secret !== process.env.EDGE_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const {
    firstName,
    lastName,
    phone,
    email,
    vehicle,
    source
  } = req.body;

  if (!phone && !email) {
    return res.status(400).json({ error: "Phone or email required" });
  }

  console.log("📥 New Lead Received:", {
    firstName,
    lastName,
    phone,
    email,
    vehicle,
    source,
    time: new Date().toISOString()
  });

  res.json({
    ok: true,
    message: "Lead received"
  });
});

app.listen(3007, () => {
  console.log("Server running on port 3007");
});




