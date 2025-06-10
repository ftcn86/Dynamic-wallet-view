
"use client"

import { useTheme } from "next-themes";
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from "@/components/ui/switch";
import { Sun, Moon, Laptop, Languages, Fingerprint, ShieldAlert } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const PI_PULSE_DEVICE_LOGIN_ENABLED_HINT_KEY = 'piPulseDeviceLoginEnabledHint';


export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { user, setUser } = useAuth();
  const { t } = useTranslation();

  type LanguageKey = 'en' | 'es' | 'fr' | 'ru' | 'pt' | 'ja' | 'zh';
  type ThemeKey = 'light' | 'dark' | 'system';

  const languageOptions: { value: LanguageKey; label: string }[] = [
    { value: 'en', label: t('settings.language.en') },
    { value: 'es', label: t('settings.language.es') },
    { value: 'fr', label: t('settings.language.fr') },
    { value: 'ru', label: t('settings.language.ru') },
    { value: 'pt', label: t('settings.language.pt') },
    { value: 'ja', label: t('settings.language.ja') },
    { value: 'zh', label: t('settings.language.zh') },
  ];

  const themeOptions: { value: ThemeKey; label: string; icon: JSX.Element }[] = [
    { value: 'light', label: t('settings.theme.light'), icon: <Sun className="h-5 w-5" /> },
    { value: 'dark', label: t('settings.theme.dark'), icon: <Moon className="h-5 w-5" /> },
    { value: 'system', label: t('settings.theme.system'), icon: <Laptop className="h-5 w-5" /> },
  ];

  const handleDeviceLoginToggle = (checked: boolean) => {
    if (user) {
      setUser({ ...user, deviceLoginEnabled: checked });
      // This flag is set so the login page can show a hint even before full user context is available.
      // It's set when the user *explicitly* changes the setting.
      if (checked) {
        localStorage.setItem(PI_PULSE_DEVICE_LOGIN_ENABLED_HINT_KEY, 'true');
      } else {
        localStorage.removeItem(PI_PULSE_DEVICE_LOGIN_ENABLED_HINT_KEY);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">{t('settings.title')}</h1>
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Languages />{t('settings.title')}</CardTitle>
          <CardDescription>Manage your application preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Theme Selection */}
          <div className="space-y-3">
            <Label className="text-lg font-medium">{t('settings.theme.label')}</Label>
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
          </div>

          <Separator />

          {/* Language Selection */}
          <div className="space-y-2">
            <Label htmlFor="language-select" className="text-lg font-medium">{t('settings.language.label')}</Label>
            <Select
              value={language}
              onValueChange={(value: LanguageKey) => setLanguage(value)}
            >
              <SelectTrigger id="language-select" className="w-full">
                <SelectValue placeholder={t('settings.language.label')} />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />
          
          {/* Device Login Setting */}
          <div className="space-y-3">
            <Label className="text-lg font-medium flex items-center">
                <ShieldAlert className="mr-2 h-5 w-5 text-primary/80" /> 
                {t('settings.security.title')}
            </Label>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="device-login-switch" className="font-medium flex items-center">
                  <Fingerprint className="mr-2 h-5 w-5" />
                  {t('settings.security.deviceLogin.label')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('settings.security.deviceLogin.description')}
                </p>
              </div>
              <Switch
                id="device-login-switch"
                checked={user?.deviceLoginEnabled || false}
                onCheckedChange={handleDeviceLoginToggle}
                aria-label={t('settings.security.deviceLogin.label')}
              />
            </div>
             <p className="text-xs text-muted-foreground px-1">
                {t('settings.security.deviceLogin.note')}
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
