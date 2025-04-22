import DarkBanner from "@/components/ui/Banner";
import EvaluationSection from "@/components/ui/Why-autograde";
import ExamEvaluator from "@/components/ExamEvaluator";
import WarmupPing from "@/components/WarmupPing";
import SystemWorkflow from "@/components/working";
import AutoGradeInstructions from "@/components/usage";

const HomePage: React.FC = () => {
  return (
    <div>
      <WarmupPing />
      <DarkBanner />
      
      <div className="my-4">
        <SystemWorkflow />
      </div>
      <div className="my-2">
        <AutoGradeInstructions />
      </div>
      
      <div className="my-2">
        <ExamEvaluator />
      </div>
      <EvaluationSection />
      {/* Other components */}
    </div>
  );
};

export default HomePage;
