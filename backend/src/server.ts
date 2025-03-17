import express from "express";
import cors from "cors";
import employeeRoutes from "./employee";

const app = express();
const PORT = process.env.PORT || 6000;

app.use(cors());
app.use(express.json());

app.use("/api/employees", employeeRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));