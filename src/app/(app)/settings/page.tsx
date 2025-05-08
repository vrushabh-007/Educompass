import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <SettingsIcon className="mr-3 h-8 w-8 text-primary" /> Settings
        </h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            This is a placeholder for account settings. Functionality like password change, email preferences, etc., would go here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Further settings options will be available in future updates.</p>
        </CardContent>
      </Card>
    </div>
  );
}
