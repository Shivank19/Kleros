import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {runAuditPipeline} from './pipeline/runAuditPipeline';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({limit: "2mb"}));

app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "kleros-audit-api"});
});

app.post("/api/audit", async(req, res) => {
    try{
        const result = await runAuditPipeline(req.body);
        res.json(result);
    } catch(error){
        console.error("Audit Error: ", error);

        res.status(500).json({
        error: "Audit failed",
        message:
            error instanceof Error ? error.message : "Unknown server error",
        });
    }
});

app.listen(PORT, () => {
  console.log(`Kleros audit API running on http://localhost:${PORT}`);
});