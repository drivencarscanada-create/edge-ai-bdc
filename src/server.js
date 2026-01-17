import express from "express";
import twilio from "twilio";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3007;

// Secret to protect /lead
const EDGE_SECRET = process.env.EDGE_SECRET || "";

// Twilio settings (from Render env vars)
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const MSG_SERVICE = process.env.TWILIO_MESSAGING_SERVICE_SID;

app.get("/", (req, res) => res.json({ ok: true, service: "edge-ai-bdc", status: "running" }));
app.get("/health", (req, res) => res.json({ ok: true }));

// ✅ This is the money endpoint: lead → SMS
app.post("/lead", async (req, res) => {
  // 1) Check secret
  if ((req.headers["x-edge-secret"] || "") !== EDGE_SECRET) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  // 2) Read lead
  const { name = "there", phone = "" } = req.body || {};

  // 3) Validate phone format
  if (!phone.startsWith("+")) {
    return res.status(400).json({ ok: false, error: "Phone must start with +1..." });
  }

  // 4) Send SMS
  await client.messages.create({
    messagingServiceSid: MSG_SERVICE,
    to: phone,
    body: `Hi ${name} — thanks for reaching out. This is Edge AI-BDC. Are you looking to book a test drive or get pricing?`
  });

  // 5) Reply to ReqBin
  res.json({ ok: true });
});

app.listen(PORT, () => console.log("Running on port", PORT));
