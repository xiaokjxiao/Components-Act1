import { useState } from "react";
import ButtonComp from "./Components/Button";
import giphy from "./assets/giphy.gif";

const Magic8Ball = () => {
  const possibleResponses = [
    "Skibidi yes yes yes! 🚽🕺",
    "For real, for real! No cap! 🧢",
    "Bet. Do it, no hesitation.",
    "W Riz! You winning this one. 🏆",
    "Certified Goofy Ahh Yes. ✅",
    "Skibidi bop, bop bop, GO GO GO!",
    "Say less, fosho! 🦙",
    "Your future looking like a clean dub.",
    "Lemme cook first… ask again later. 🍳",
    "Skibidi buffering… loading answer… 🔄🚽",
    "Might be a yes, might be an L, IDK.",
    "Bro, even the toilet camera is confused. 📷🚽",
    "If I had a dollar for every time you asked, I'd be rich. 💰",
    "Man, even G-man ain't got the answer to this.",
    "Skibidi nah nah nah. ⛔🚽",
    "L move, don't do it. 🏳️",~
    "My guy, this is a bad idea. 🪠",
    "Bro, even Titan Speakerman facepalmed. 📟",
    "Certified clown moment if you go through with this. 🤡",
    "You about to get ratio'd by fate. 📉",
    "Not even Da Skibidi Rizzler can save you now.",
      "You are cooked!"
    ];

  
  const [response, setResponse] = useState<string | null>(null);
  
    const handleAsk = () => {
      const randomResponse = possibleResponses[Math.floor(Math.random() * possibleResponses.length)] as string;
      setResponse(randomResponse);
    };
  
    const handleReset = () => {
      setResponse(null);
    };
  
    return (
      <div className="flex flex-col items-center bg-[#1A1A1D] min-h-screen w-screen h-screen space-y-10"> 
        <div className="flex flex-col items-center space-y-3 mt-25">
          <h1 className="text-5xl text-white font-medium">The Magic 8 Ball</h1>
          <p className="text-white font-light">Ask a question and let the Magic 8 Ball decide your fate.</p>
        </div>
        <div>
          <img src={giphy} alt="Magic 8 Ball" className="w-35 h-35"/>       
        </div>
        <div className="flex items-center justify-between">
          <ButtonComp onClick={handleAsk} label="Ask"/>
          <ButtonComp onClick={handleReset} label="Reset"/>
        </div>
        <div>
          {response && <p className="text-2xl text-white mt-4 text-center me-2 mb-2 px-3">{response}</p>}
        </div>
      </div>
    );
  };

export default Magic8Ball;