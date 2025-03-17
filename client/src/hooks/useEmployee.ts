import { useState, useEffect } from "react";
import { Employee } from "../types/datatypes";

export const useEmployee = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    groupName: "",
    role: "",
    expectedSalary: 0,
    expectedDateOfDefense: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch all employees
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      console.log("Fetching employees...");
  
      const response = await fetch("http://localhost:5000/api/employees/get"); 
  
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${await response.text()}`);
      }
  
      const data = await response.json();
      console.log("Employees fetched:", data);
  
      setEmployees(data); 
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };
  
  

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "expectedSalary" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const url = isEditing
      ? `http://localhost:5000/api/employees/update/${formData.id}`
      : "http://localhost:5000/api/employees/add";
  
    const method = isEditing ? "PATCH" : "POST";
  
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          expectedSalary: Number(formData.expectedSalary),
          expectedDateOfDefense: new Date(formData.expectedDateOfDefense).toISOString(),
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }
  
      await fetchEmployees(); 
      resetForm();
    } catch (error) {
      console.error("Error submitting employee:", error);
    }
  };
  

  const handleEdit = (employee: Employee) => {
    setFormData({
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      groupName: employee.groupName,
      role: employee.role,
      expectedSalary: employee.expectedSalary,
      expectedDateOfDefense: employee.expectedDateOfDefense.split("T")[0], // Ensure correct date format for input field
    });
    setIsEditing(true);
  };
  


  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/employees/delete/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }
  
      fetchEmployees();
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };
  

  
  const resetForm = () => {
    setFormData({
      id: "",
      firstName: "",
      lastName: "",
      groupName: "",
      role: "",
      expectedSalary: 0,
      expectedDateOfDefense: "",
    });
    setIsEditing(false);
  };

  return {
    employees,
    formData,
    isEditing,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm,
  };
};