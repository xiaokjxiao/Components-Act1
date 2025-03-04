import { useState, useEffect } from "react";
import ButtonComp from "./Components/Button";
import InputField from "./Components/Input";
import giphy from "./assets/giphy.gif";

const API_URL = "http://localhost:5000"; 

const Magic8Ball = () => {
  const [possibleResponses, setPossibleResponses] = useState<string[]>([]);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customResponse, setCustomResponse] = useState<string>("");

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await fetch(`${API_URL}/get-response`);
        const data = await res.json();
        setPossibleResponses(data.map((item: { text: string }) => item.text));
      } catch {
        setError("Failed to fetch responses.");
      }
    };
    fetchResponses();
  }, []);

  const handleAsk = () => {
    if (possibleResponses.length === 0) {
      setError("No responses available. Add one first.");
      return;
    }
    const randomIndex = Math.floor(Math.random() * possibleResponses.length);
    setResponse(possibleResponses[randomIndex]);
    setError(null);
  };

  const handleAddResponse = async () => {
    if (!customResponse.trim()) return;
    try {
      const res = await fetch(`${API_URL}/add-response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: customResponse }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }
      setPossibleResponses([...possibleResponses, data.text]); 
      setCustomResponse("");
    } catch {
      setError("Failed to add response.");
    }
  };

  return (
    <div className="flex flex-col items-center bg-[#1A1A1D] min-h-screen w-full space-y-10 py-10">
      {/* Header Section */}
      <header className="flex flex-col items-center space-y-3 mt-10">
        <h1 className="text-5xl text-white font-medium">The Magic 8 Ball</h1>
        <p className="text-white font-light">Ask a question and let the Magic 8 Ball decide your fate.</p>
      </header>
  
      <img src={giphy} alt="Magic 8 Ball" className="w-35 h-35" />

      {error && <p className="text-red-500 text-center">{error}</p>}
      {response && <p className="text-white text-xl text-center">{response}</p>}

      <div className="flex flex-col items-center space-y-6 w-full max-w-md px-4">
        <ButtonComp onClick={handleAsk} label="Ask" />
  
        <div className="flex flex-col space-y-4 w-full">
          <InputField
            label="Add your own response"
            id="customResponse"
            value={customResponse}
            onChange={(e) => setCustomResponse(e.target.value)}
          />
          <ButtonComp onClick={handleAddResponse} label="Add Response" />
        </div>
      </div>
  
      
    </div>
  );
};

export default Magic8Ball;
