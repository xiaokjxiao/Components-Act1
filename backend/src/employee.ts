import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const employeeRoutes = Router();
const prisma = new PrismaClient();

employeeRoutes.post("/add", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      groupName,
      role,
      expectedSalary,
      expectedDateOfDefense,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !groupName ||
      !role ||
      !expectedSalary ||
      !expectedDateOfDefense
    ) {
      res.status(400).json({ error: "All fields are required" });
    }

    const newEmployee = await prisma.form.create({
      data: {
        firstName,
        lastName,
        groupName,
        role,
        expectedSalary,
        expectedDateOfDefense: new Date(expectedDateOfDefense),
      },
    });

    res.status(201).json(newEmployee);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error.message });
  }
});

employeeRoutes.get(
  "/get",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const employees = await prisma.form.findMany();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  }
);

employeeRoutes.patch("/update/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      let updateData = req.body;
  
      if (!id) {
         res.status(400).json({ error: "Invalid employee ID" });
      }
  
      if (updateData.expectedDateOfDefense) {
        updateData.expectedDateOfDefense = new Date(updateData.expectedDateOfDefense);
      }
  
      const existingEmployee = await prisma.form.findUnique({
        where: { id },
      });
  
      if (!existingEmployee) {
         res.status(404).json({ error: "Employee not found" });
      }
  
      if (Object.keys(updateData).length === 0) {
         res.status(400).json({ error: "No valid fields provided for update" });
      }
  
      const updatedEmployee = await prisma.form.update({
        where: { id },
        data: updateData, 
      });
  
       res.status(200).json(updatedEmployee);
    } catch (error) {
      console.error("Error updating employee:", error);
       res.status(500).json({ error: "Failed to update employee" });
    }
  });

  
employeeRoutes.delete("/delete/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Invalid employee ID" });
    }

    const existingEmployee = await prisma.form.findUnique({
      where: { id },
    });

    if (!existingEmployee) {
      res.status(404).json({ error: "Employee not found" });
    }

    await prisma.form.delete({
      where: { id },
    });

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

export default employeeRoutes;
