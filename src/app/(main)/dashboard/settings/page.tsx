"use client"

import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sun, Moon, Laptop, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  type ThemeKey = 'light' | 'dark' | 'system';

  const themeOptions: { value: ThemeKey; label: string; icon: JSX.Element }[] = [
    { value: 'light', label: "Light", icon: <Sun className="h-5 w-5" /> },
    { value: 'dark', label: "Dark", icon: <Moon className="h-5 w-5" /> },
    { value: 'system', label: "System", icon: <Laptop className="h-5 w-5" /> },
  ];

  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-bold font-headline">Application Settings</h1>
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5 text-primary" />
            Display Preferences
            </CardTitle>
          <CardDescription>Manage your application preferences to suit your style.</CardDescription>
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
    </div>
  );
}
