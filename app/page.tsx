import DarkBanner from "@/components/ui/Banner";
import EvaluationSection from "@/components/ui/Why-autograde";
import ExamEvaluator from "@/components/ExamEvaluator";
import WarmupPing from "@/components/WarmupPing";
import SystemWorkflow from "@/components/working";

const HomePage: React.FC = () => {
  return (
    <div>
      <WarmupPing />
      <DarkBanner />
      
      <div className="my-8">
        <SystemWorkflow />
      </div>
      
      <div className="my-8">
        <ExamEvaluator />
      </div>
      <EvaluationSection />
      {/* Other components */}
    </div>
  );
};

export default HomePage;
