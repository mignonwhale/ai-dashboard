import DashboardLayout from "@/components/DashboardLayout";
import SettingsPanel from "@/components/SettingsPanel";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-foreground/60 mt-2">
            Configure your AI dashboard preferences and API settings
          </p>
        </div>
        
        <SettingsPanel />
      </div>
    </DashboardLayout>
  );
}