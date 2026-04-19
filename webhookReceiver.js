const express = require("express");
const crypto = require("crypto");
const pool = require('./config/db');

const app = express();

app.use(express.json());

const SECRET = "supersecretkey"

app.post("/webhook-receiver", async (req, res) => {

    try {

        console.log("Webhook payload:", req.body);
        const signature = req.headers["x-webhook-signature"];

        const body = JSON.stringify(req.body);

        const expected = crypto
            .createHmac("sha256", SECRET)
            .update(body)
            .digest("hex");

        if (signature !== expected) {
            return res.status(401).send("Invalid signature");
        }

        const { webhookId, event } = req.body;

        // idempotency check
        const existing = await pool.query(
            "SELECT * FROM webhook_logs WHERE webhook_id = $1",
            [webhookId]
        );

        if (existing.rows.length > 0) {
            console.log("Duplicate webhook ignored");
            return res.status(200).send("duplicate ignored");
        }

        // store webhook
        await pool.query(
            `INSERT INTO webhook_logs 
            (webhook_id, event_type, payload, status) 
            VALUES ($1,$2,$3,$4)`,
            [webhookId, event, req.body, "processed"]
        );

        console.log("Webhook processed safely");

        res.status(200).json({
            message: "Webhook processed"
        });

    } catch (error) {
        console.log("Webhook error", error);
        res.status(500).send("error");
    }

});

app.get("/webhook-logs", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM webhook_logs ORDER BY created_at DESC");
        res.status(200).json(result.rows);
    } catch (error) {
        console.log("Error fetching logs", error);
        res.status(500).send("error");
    }
}
)

app.listen(4000, "0.0.0.0", () => {
    console.log("Webhook receiver running on port 4000");
});