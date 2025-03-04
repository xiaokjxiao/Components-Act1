// interface InputFieldProps {
//   id: string;
//   type?: string;
//   placeholder?: string;
//   value: string;
//   onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
// }

// const InputField: React.FC<InputFieldProps> = ({id, type = "text", placeholder, value, onChange }) => {
//     return (
//       <div className="mb-6">
//         <label htmlFor={id} className="text-sm font-medium text-gray-900 dark:text-white">
//         </label>
//         <input
//           type={type}
//           id={id}
//           placeholder={placeholder}
//           value={value}
//           onChange={onChange}
//           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//         />
//       </div>
//     );
//   };
  
//   export default InputField;

interface Employee {
  id: number;
  name: string;
  role: string
  salary: number;
}

interface DisplayCompProps {
  employees: Employee[];
}

const DisplayComp: React.FC<DisplayCompProps> = ({ employees }) => {
  return (
    <div className="justify-center items-center w-full">
      <h2 className="text-2xl font-bold mb-4">Employee List</h2>
      <div className="flex flex-col">
        <div className="flex font-bold">
          <div className="w-1/4 p-2">ID</div>
          <div className="w-1/4 p-2">Name</div>
          <div className="w-1/4 p-2">Role</div>
          <div className="w-1/4 p-2">Salary</div>
        </div>
        {employees.map((employee) => (
          <div key={employee.id} className="flex border-t">
            <div className="w-1/4 p-2">{employee.id}</div>
            <div className="w-1/4 p-2">{employee.name}</div>
            <div className="w-1/4 p-2">{employee.role}</div>
            <div className="w-1/4 p-2">{employee.salary}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayComp;

  