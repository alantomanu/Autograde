import DarkBanner from "@/components/ui/Banner";
import EvaluationSection from "@/components/ui/Why-autograde";
import ExamEvaluator from "@/components/ExamEvaluator";
const HomePage: React.FC = () => {
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
