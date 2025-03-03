import { useState, useEffect } from "react";
import ButtonComp from "./Components/Button";
import InputField from "./Components/Input";
import giphy from "./assets/giphy.gif";

const Magic8Ball = () => {
  const [response, setResponse] = useState<string | number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customResponse, setCustomResponse] = useState("");
  const [responses, setResponses] = useState<string[]>([]);

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const res = await fetch("http://localhost:5000/get-responses");
      const data = await res.json();
      setResponses(data.responses);
    } catch (err) {
      console.error("Error fetching responses:", err);
    }
  };

  const fetchResponse = async () => {
    try {
      const res = await fetch("http://localhost:5000/get-response");
      const data = await res.json();
      setResponse(data.response);
      setError(null);
    } catch (err) {
      console.error("Error fetching response:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  const addResponse = async () => {
    try {
      await fetch("http://localhost:5000/add-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: customResponse }),
      });
      setCustomResponse("");
      fetchResponses();
    } catch (err) {
      console.error("Error adding response:", err);
    }
  };

  const handleReset = () => {
    setResponse(null);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center bg-[#1A1A1D] min-h-screen w-screen h-screen space-y-10"> 
      <header className="flex flex-col items-center space-y-3 mt-25">
        <h1 className="text-5xl text-white font-medium">The Magic 8 Ball</h1>
        <p className="text-white font-light">Ask a question and let the Magic 8 Ball decide your fate.</p>
      </header>
      <img src={giphy} alt="Magic 8 Ball" className="w-35 h-35"/>       
      <div className="flex items-center justify-between">
        <ButtonComp onClick={fetchResponse} label="Ask"/>
        <ButtonComp onClick={handleReset} label="Reset"/>
      </div>
      <div className="item-center justify-center"> 
        <InputField 
          label="Add your own response" 
          id="customResponse" 
          value={customResponse} 
          onChange={(e) => setCustomResponse(e.target.value)}
        />
        <ButtonComp onClick={addResponse} label="Submit Response"/>
      </div>
      <div>
        {error && <p className="text-red-500 text-xl mt-4 text-center">{error}</p>}
        {response && <p className="text-2xl text-white mt-4 text-center me-2 mb-2 px-3">{response}</p>}
      </div>
      <div className="text-white mt-5">
        <h2 className="text-lg font-medium">Stored Responses:</h2>
        <ul>
          {responses.map((res, index) => (
            <li key={index} className="mt-2">{res}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Magic8Ball;