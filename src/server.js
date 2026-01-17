import express from "express";
import twilio from "twilio";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3007;

const EDGE_SECRET = process.env.EDGE_SECRET;

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.post("/lead", async (req, res) => {
  if (req.headers["x-edge-secret"] !== EDGE_SECRET) {
    return res.status(401).json({ ok: false });
  }

  const { name, phone } = req.body;

  await client.messages.create({
    messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
    to: phone,
    body: `Hi ${name}, thanks for reaching out. This is Edge AI BDC.`
  });

  res.json({ ok: true });
});

app.listen(PORT, () => console.log("Running"));






