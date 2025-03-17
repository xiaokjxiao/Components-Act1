import React, { useState, useEffect } from "react";

const EmployeeForm = () => {
  interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    groupName: string;
    role: string;
    expectedSalary: number;
    expectedDateOfDefense: string;
  }

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
      const response = await fetch("/api/get-employees");
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: name === "expectedSalary" ? Number(value) : value,
    });
  };

  // Add or update employee
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = isEditing
      ? `/update/${formData.id}`
      : "/add";
  
    try {
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST", // Specify the correct HTTP method
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          expectedDateOfDefense: new Date(
            formData.expectedDateOfDefense
          ).toISOString(),
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(isEditing ? "Employee updated:" : "Employee added:", data);
        fetchEmployees(); // Refresh the list
        resetForm();
      } else {
        console.error("Failed to submit employee:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to submit employee:", error);
    }
  };
  

  // Edit employee
  const handleEdit = (employee: Employee) => {
    setFormData({
      ...employee,
      expectedSalary: employee.expectedSalary,
    });
    setIsEditing(true);
  };

  // Delete employee
  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/delete-employees/${id}`, {
        method: "DELETE",
      });
      console.log("Employee deleted successfully");
      fetchEmployees(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  // Reset form
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

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Employee Management</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="groupName"
            placeholder="Group Name"
            value={formData.groupName}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="role"
            placeholder="Role"
            value={formData.role}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="expectedSalary"
            placeholder="Expected Salary"
            value={formData.expectedSalary}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="date"
            name="expectedDateOfDefense"
            placeholder="Expected Date of Defense"
            value={formData.expectedDateOfDefense}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isEditing ? "Update Employee" : "Add Employee"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={resetForm}
            className="mt-4 ml-2 px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Employee List */}
      <div>
        <h2 className="text-xl font-bold mb-4">Employee List</h2>
        <ul>
          {employees.map((employee) => (
            <li key={employee.id} className="mb-4 p-4 border rounded">
              <div className="flex justify-between items-center">
                <div>
                  <p>
                    {employee.firstName} {employee.lastName}
                  </p>
                  <p>{employee.groupName}</p>
                  <p>{employee.role}</p>
                  <p>${employee.expectedSalary}</p>
                  <p>{employee.expectedDateOfDefense}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleEdit(employee)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmployeeForm;
