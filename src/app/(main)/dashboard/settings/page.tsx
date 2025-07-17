
"use client"

import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sun, Moon, Laptop, Settings, Bell, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, setUser } = useAuth();
  const { toast } = useToast();

  const [isSaving, setIsSaving] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(user?.settings?.remindersEnabled || false);
  const [reminderHours, setReminderHours] = useState(user?.settings?.reminderHoursBefore || 1);

  useEffect(() => {
    if (user?.settings) {
      setRemindersEnabled(user.settings.remindersEnabled);
      setReminderHours(user.settings.reminderHoursBefore);
    }
  }, [user?.settings]);
  
  if (!user || !user.settings) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    );
  }
  
  const handleReminderTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0.5, Math.min(23.5, parseFloat(e.target.value) || 0));
    setReminderHours(value);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    setUser(prevUser => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        settings: {
          remindersEnabled: remindersEnabled,
          reminderHoursBefore: reminderHours,
        }
      }
    });

    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSaving(false);
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  type ThemeKey = 'light' | 'dark' | 'system';

  const themeOptions: { value: ThemeKey; label: string; icon: JSX.Element }[] = [
    { value: 'light', label: "Light", icon: <Sun className="h-5 w-5" /> },
    { value: 'dark', label: "Dark", icon: <Moon className="h-5 w-5" /> },
    { value: 'system', label: "System", icon: <Laptop className="h-5 w-5" /> },
  ];

  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-bold font-headline">Application Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-primary" />
              Display Preferences
              </CardTitle>
            <CardDescription>Manage your application theme to suit your style.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <div className="space-y-3">
              <Label className="text-lg font-medium">Theme</Label>
              <div className="flex space-x-2 rounded-md bg-muted p-1">
                {themeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={theme === option.value ? "default" : "ghost"}
                    onClick={() => setTheme(option.value)}
                    className="w-full flex items-center justify-center gap-2"
                    aria-pressed={theme === option.value}
                  >
                    {option.icon}
                    {option.label}
                  </Button>
                ))}
              </div>
               <p className="text-sm text-muted-foreground">Choose between light, dark, or your system's default theme.</p>
            </div>
          </CardContent>
        </Card>
         <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5 text-primary" />
              Notifications
              </CardTitle>
            <CardDescription>Control how you receive important updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
              <Label htmlFor="reminders-enabled" className="flex flex-col space-y-1">
                <span>Mining Session Reminders</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Get a notification before your session expires.
                </span>
              </Label>
              <Switch
                id="reminders-enabled"
                checked={remindersEnabled}
                onCheckedChange={setRemindersEnabled}
              />
            </div>
            {remindersEnabled && (
               <div className="space-y-2">
                <Label htmlFor="reminder-time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4"/>
                  Remind Me Before Session End
                </Label>
                <div className="relative">
                  <Input
                    id="reminder-time"
                    type="number"
                    value={reminderHours}
                    onChange={handleReminderTimeChange}
                    className="pr-16"
                    min="0.5"
                    max="23.5"
                    step="0.5"
                  />
                  <span className="absolute inset-y-0 right-4 flex items-center text-sm text-muted-foreground">hours</span>
                </div>
               </div>
            )}
             <Button onClick={handleSaveSettings} disabled={isSaving} className="w-full">
                {isSaving && <LoadingSpinner className="mr-2"/>}
                {isSaving ? "Saving..." : "Save Notification Settings"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
