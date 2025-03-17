import React from "react";
import { useEmployee } from "../hooks/useEmployee";

const EmployeeForm = () => {
  const {
    employees,
    formData,
    isEditing,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm,
  } = useEmployee();

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
            value={formData.expectedDateOfDefense}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
        </div>
        
        {/* Submit Button */}
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          {isEditing ? "Save Changes" : "Add Employee"}
        </button>

        {/* Cancel Button when Editing */}
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
