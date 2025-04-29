'use client';

// This is a placeholder page for general application settings.
// It can be expanded with options like theme (light/dark), notifications, etc.

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  // Add state and handlers for settings later
  // const [darkMode, setDarkMode] = useState(false);
  // const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your application preferences.</p>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your SPAT experience.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           {/* Example Setting 1: Dark Mode (requires theme switching logic) */}
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
              <span>Dark Mode</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Enable dark theme for the application. (UI Placeholder)
              </span>
            </Label>
            <Switch
                id="dark-mode"
                // checked={darkMode}
                // onCheckedChange={setDarkMode}
                disabled // Disabled until theme switching is implemented
             />
          </div>

           {/* Example Setting 2: Notifications */}
           <div className="flex items-center justify-between">
            <Label htmlFor="notifications" className="flex flex-col space-y-1">
              <span>Email Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receive updates and reminders via email. (UI Placeholder)
              </span>
            </Label>
            <Switch
                id="notifications"
                // checked={notificationsEnabled}
                // onCheckedChange={setNotificationsEnabled}
                 disabled // Disabled until notification logic is implemented
            />
          </div>

           {/* More settings can be added here */}

        </CardContent>
      </Card>
    </div>
  );
}
