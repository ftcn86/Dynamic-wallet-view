
"use client"

import { useTheme } from "next-themes";
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sun, Moon, Laptop, Languages } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";


export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth(); // user might still be useful for other settings
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
    { value: 'light', label: t('settings.theme.light'), icon: <Sun className="h-5 w-5 text-yellow-500" /> },
    { value: 'dark', label: t('settings.theme.dark'), icon: <Moon className="h-5 w-5 text-blue-500" /> },
    { value: 'system', label: t('settings.theme.system'), icon: <Laptop className="h-5 w-5 text-muted-foreground" /> },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">{t('settings.title')}</h1>
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="text-primary" />
            {t('settings.title')}
          </CardTitle>
          <CardDescription>Manage your application preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
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

        </CardContent>
      </Card>
    </div>
  );
}
