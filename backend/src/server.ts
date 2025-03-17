import express, { Request, Response, Application } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app: Application = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Get all employees
app.get("/api/get-employees", async (req: Request, res: Response): Promise<void> => {
  try {
    const employees = await prisma.form.findMany();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

// Get a single employee by ID
app.get("/api/get-employees/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const employee = await prisma.form.findUnique({ where: { id } });
    if (!employee) {
      res.status(404).json({ error: "Employee not found" });
      return;
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employee" });
  }
});

// Add a new employee
app.post("/api/post-employees", async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, groupName, role, expectedSalary, expectedDateOfDefense } = req.body;
    const newEmployee = await prisma.form.create({
      data: { firstName, lastName, groupName, role, expectedSalary, expectedDateOfDefense }
    });
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ error: "Failed to add employee" });
  }
});

// Update an employee
app.put("/api/post-employees/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedEmployee = await prisma.form.update({
      where: { id },
      data: req.body,
    });
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: "Failed to update employee" });
  }
});

// Delete an employee
app.delete("/api/delete-employees/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.form.delete({ where: { id } });
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));