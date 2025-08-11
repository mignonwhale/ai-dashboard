import DashboardLayout from "@/components/DashboardLayout";
import ConversationHistory from "@/components/ConversationHistory";

export default function ConversationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Conversations</h1>
          <p className="text-foreground/60 mt-2">
            Manage and review your AI conversation history
          </p>
        </div>
        
        <ConversationHistory />
      </div>
    </DashboardLayout>
  );
}