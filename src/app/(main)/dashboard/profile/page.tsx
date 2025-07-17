
"use client"

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload } from 'lucide-react';
import { mockApiCall } from '@/lib/api';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || 'https://placehold.co/128x128.png');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return <div className="flex h-full w-full items-center justify-center"><LoadingSpinner size={32} /></div>;

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updatedUserData = { ...user, name: displayName, bio, avatarUrl };
      await mockApiCall({ data: updatedUserData }); 
      
      setUser(updatedUserData); 
      
      toast({
        title: "Profile Saved!",
        description: "Your profile information has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Save failed!",
        description: "There was an error saving your profile. Please try again.",
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarUrl(URL.createObjectURL(file));
    }
  };
  
  const avatarFallback = displayName ? displayName.split(' ').map(n => n[0]).join('').toUpperCase() : '?';

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Edit Profile</h1>
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Update your personal information and avatar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32 ring-4 ring-primary/20 ring-offset-background ring-offset-2">
                <AvatarImage src={avatarUrl} alt={displayName} data-ai-hint="person face" />
                <AvatarFallback className="text-4xl">{avatarFallback}</AvatarFallback>
              </Avatar>
              <Button asChild variant="outline">
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                  <Input 
                    id="avatar-upload" 
                    type="file" 
                    className="sr-only"
                    accept="image/*" 
                    onChange={handleAvatarChange}
                  />
                </Label>
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                placeholder="Your Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Tell us a little about yourself"
              />
            </div>
            <CardFooter className="px-0 pb-0 pt-2">
                <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving ? <LoadingSpinner className="mr-2 h-4 w-4" /> : null}
                {isSaving ? "Saving..." : "Save Profile"}
                </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
