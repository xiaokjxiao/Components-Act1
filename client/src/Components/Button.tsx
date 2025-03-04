// const ButtonComp = ({ onClick, label }: { onClick: () => void; label: string }) => {
//     return (
//         <button onClick={onClick}
//             className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-l dark:shadow-purple-800/80 font-medium rounded-sm text-sm px-5 py-2.5 text-center cursor-pointer transition duration-200 ease-in-out transform active:scale-90">
//             {label}
//         </button>
//     );
// };

// export default ButtonComp;

import React from 'react';

interface Employee {
    id: number;
    name: string;
    salary: number;
}

interface FilterCompProps {
    employees: Employee[];
}

const FilterComp: React.FC<FilterCompProps> = ({ employees }) => {
    const entryLevelEmployees = employees.filter(emp => emp.salary < 50000);
    const seniorEmployees = employees.filter(emp => emp.salary >= 50000);

    return (
        <div className='justify-center items-center'>
            <h2 className="text-2xl font-bold mb-4">Entry Level</h2>
            <div className="flex flex-col">
                <div className="flex font-bold">
                    <div className="w-1/2 p-2">Name</div>
                    <div className="w-1/2 p-2">Salary</div>
                </div>
                {entryLevelEmployees.map(emp => (
                    <div key={emp.id} className="flex border-t">
                        <div className="w-1/2 p-2">{emp.name}</div>
                        <div className="w-1/2 p-2">{emp.salary}</div>
                    </div>
                ))}
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Senior</h2>
            <div className="flex flex-col">
                <div className="flex font-bold">
                    <div className="w-1/2 p-2">Name</div>
                    <div className="w-1/2 p-2">Salary</div>
                </div>
                {seniorEmployees.map(emp => (
                    <div key={emp.id} className="flex border-t">
                        <div className="w-1/2 p-2">{emp.name}</div>
                        <div className="w-1/2 p-2">{emp.salary}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FilterComp;