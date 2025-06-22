
"use client"

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle2 } from 'lucide-react';
import { mockApiCall } from '@/lib/api';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || 'https://placehold.co/128x128.png');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return <div className="flex h-full items-center justify-center"><LoadingSpinner /></div>;

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // In a real app, this would be an API call to your backend.
      // We simulate it and then update the local context state.
      const updatedUserData = { ...user, name: displayName, bio, avatarUrl };
      await mockApiCall({ data: updatedUserData }); // Simulate network delay
      
      setUser(updatedUserData); 
      
      toast({
        title: t('profile.successToast'),
      });
    } catch (error) {
      toast({
        title: t('profile.errorToast'),
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // In a real app, you would upload this file to a storage service
      // and get back a URL. For the prototype, we use a local object URL.
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">{t('profile.title')}</h1>
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle2 className="text-primary" />
            {t('profile.title')}
          </CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="space-y-2 text-center">
              <Label htmlFor="avatar-upload">{t('profile.profilePicture')}</Label>
              <Avatar className="h-32 w-32 mx-auto ring-2 ring-primary ring-offset-2">
                <AvatarImage src={avatarUrl} alt={displayName} data-ai-hint="person face" />
                <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Input 
                id="avatar-upload" 
                type="file" 
                className="mx-auto max-w-xs" 
                accept="image/*" 
                onChange={handleAvatarChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">{t('profile.displayName')}</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">{t('profile.bio')}</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
              />
            </div>
            <Button type="submit" disabled={isSaving} className="w-full">
              {isSaving ? <LoadingSpinner className="mr-2 h-4 w-4" /> : null}
              {isSaving ? t('profile.saving') : t('profile.saveButton')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
