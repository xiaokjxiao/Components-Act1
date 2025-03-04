// import Magic8Ball from "./Magic8Ball";

// const LandingPage = () => {
//   return (
//     <div className="flex flex-col items-center min-h-screen w-screen h-screen justify-center">
//       <Magic8Ball />
//     </div>
//   );
// };

// export default LandingPage;

import { useEffect, useState } from 'react';
import DisplayComp from './Components/Input';
import FilterComp from './Components/Button';

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/employees');
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    }
    fetchEmployees();
  }, []);

  return (
      <div className='justify-center items-center bg-gray-200'>
        <DisplayComp employees={employees} />
        <FilterComp employees={employees} />
        {error && <div className="error">{error}</div>}
      </div>
  );
};

export default App;
