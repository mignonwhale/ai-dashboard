import DashboardLayout from "@/components/DashboardLayout";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-foreground/60 mt-2">
            Detailed analytics and insights for your AI model usage
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Analytics Coming Soon</h3>
          <p className="text-foreground/60 max-w-md mx-auto">
            We're working on advanced analytics features including usage trends, 
            cost optimization insights, and performance benchmarking.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}