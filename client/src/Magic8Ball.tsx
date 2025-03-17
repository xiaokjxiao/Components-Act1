// import { useState, useEffect } from "react";
// import ButtonComp from "./Components/Button";
// import InputField from "./Components/Input";
// import giphy from "./assets/giphy.gif";

// const API_URL = "http://localhost:5000"; 

// const Magic8Ball = () => {
//   const [possibleResponses, setPossibleResponses] = useState<string[]>([]);
//   const [response, setResponse] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [customResponse, setCustomResponse] = useState<string>("");

//   useEffect(() => {
//     const fetchResponses = async () => {
//       try {
//         const res = await fetch(`${API_URL}/get-response`);
//         const data = await res.json();
//         setPossibleResponses(data.map((item: { text: string }) => item.text));
//       } catch {
//         setError("Failed to fetch responses.");
//       }
//     };
//     fetchResponses();
//   }, []);

//   const handleAsk = () => {
//     if (possibleResponses.length === 0) {
//       setError("No responses available. Add one first.");
//       return;
//     }
//     const randomIndex = Math.floor(Math.random() * possibleResponses.length);
//     setResponse(possibleResponses[randomIndex]);
//     setError(null);
//   };

//   const handleReset = () => {
//     setResponse(null);
//     setError(null);
//   }

//   const handleAddResponse = async () => {
//     if (!customResponse.trim()) return;
//     try {
//       const res = await fetch(`${API_URL}/add-response`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text: customResponse }),
//       });

//       const data = await res.json();

//       if (data.error) {
//         throw new Error(data.error);
//       }
//       setPossibleResponses([...possibleResponses, data.text]); 
//       setCustomResponse("");
//     } catch {
//       setError("Failed to add response.");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center bg-[#1A1A1D] min-h-screen w-full space-y-10 py-10">
//       {/* Header Section */}
//       <header className="flex flex-col items-center space-y-3 mt-10">
//         <h1 className="text-5xl text-white font-medium">The Magic 8 Ball</h1>
//         <p className="text-white font-light">Ask a question and let the Magic 8 Ball decide your fate.</p>
//       </header>
  
//       <img src={giphy} alt="Magic 8 Ball" className="w-35 h-35" />

//       {error && <p className="text-red-500 font-bold text-center">{error}</p>}
//       {response && <p className="text-white text-xl font-bold text-center">{response}</p>}

//       <div className="flex flex-col items-center w-full max-w-md px-4">
//         <div className="flex space-x-4">
//         <ButtonComp onClick={handleAsk} label="Ask" />
//         <ButtonComp onClick={handleReset} label="Reset" />
//         </div>
//         <div className="flex flex-row mt-5">
//           <InputField
//             placeholder="Add your own response"
//             id="customResponse"
//             value={customResponse}
//             onChange={(e) => setCustomResponse(e.target.value)}
//           />
//         </div>
//         <ButtonComp onClick={handleAddResponse} label="Add Response" />
//       </div>
//     </div>
//   );
// };

// export default Magic8Ball;

//----------------------------------- 2nd activity

import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000";

const DisplayComp = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        groupName: "",
        role: "",
        expectedSalary: "",
        expectedDateOfDefense: "",
    });

    const fetchFormData = async () => {
        try {
            const res = await fetch(`${API_URL}/api/get-employees`);
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setFormData(data);
        } catch (error) {
            console.error("Failed to fetch form data:", error);
        }
    };


    const deleteFormData = async () => {
        try {
            await fetch(`${API_URL}/api/delete-employees`, {
                method: "DELETE",
            });
            setFormData({
                firstName: "",
                lastName: "",
                groupName: "",
                role: "",
                expectedSalary: "",
                expectedDateOfDefense: "",
            });
        } catch (error) {
            console.error("Failed to delete form data:", error);
        }
    };

    useEffect(() => {
        fetchFormData();
    }, []);

    

    return (
        <div className='justify-center items-center'>
            <div className="mt-6 p-4 bg-gray-100 rounded-xl shadow">
                <h3 className="text-lg font-semibold">Candidate Details</h3>
                <p><strong>First Name:</strong> {formData.firstName}</p>
                <p><strong>Last Name:</strong> {formData.lastName}</p>
                <p><strong>Group Name:</strong> {formData.groupName}</p>
                <p><strong>Role:</strong> {formData.role}</p>
                <p><strong>Expected Salary:</strong> {formData.expectedSalary}</p>
                <p><strong>Expected Date of Defense:</strong> {formData.expectedDateOfDefense}</p>
                <button 
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg" 
                    onClick={() => setFormData({ ...formData, firstName: "Updated" })}>
                    Edit
                </button>
                <button 
                    className="mt-4 ml-2 px-4 py-2 bg-red-500 text-white rounded-lg" 
                    onClick={deleteFormData}>
                    Delete
                </button>
            </div>
        </div>
    );
};

export default DisplayComp;

