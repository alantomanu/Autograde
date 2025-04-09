import DarkBanner from "@/components/ui/Banner";
import EvaluationSection from "@/components/ui/Why-autograde";
import ExamEvaluator from "@/components/ExamEvaluator";
import { useEffect } from "react";

const HomePage: React.FC = () => {
  useEffect(() => {
    const ping = () => {
      fetch('https://autograde-server.koyeb.app/ping')
        .then(res => res.text())
        .then(data => console.log('Backend pinged:', data))
        .catch(err => console.error('Error pinging backend:', err));
    };

    ping(); 

    const interval = setInterval(ping, 1000 * 60 * 7); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <div>
      <DarkBanner />
      <div className="my-8"> {/* Add margin above and below the ExamEvaluator */}
        <ExamEvaluator />
      </div>
      <EvaluationSection />
      {/* Other components */}
    </div>
  );
};

export default HomePage;
