import express, { Request, Response, Application } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app: Application = express(); 
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json()); 

app.get("/get-response", async (req: Request, res: Response): Promise<void> => {
  try {
    const responses = await prisma.magic8BallResponse.findMany();
    res.json(responses);
  } catch (error) {
    console.error("Error getting responses:", error);
    res.status(500).json({ error: "Failed to get responses" });
  }
});

app.post("/add-response", async (req: Request, res: Response): Promise<void> => {
  try {
    const { text } = req.body as { text: string }; 
    
    if (!text || typeof text !== "string") {
      res.status(400).json({ error: "Response text is required" });
      return;
    }

    const newResponse = await prisma.magic8BallResponse.create({
      data: { text },
    });

    res.status(201).json(newResponse);
  } catch (error) {
    console.error("Error adding response:", error);
    res.status(500).json({ error: "Failed to add response" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
