import DashboardLayout from "@/components/DashboardLayout";
import ModelComparison from "@/components/ModelComparison";

export default function ComparisonPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Model Comparison</h1>
          <p className="text-foreground/60 mt-2">
            Compare performance, cost, and capabilities across different AI models
          </p>
        </div>
        
        <ModelComparison />
      </div>
    </DashboardLayout>
  );
}