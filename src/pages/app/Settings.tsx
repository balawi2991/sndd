import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [workspace, setWorkspace] = useState({
    name: 'My Workspace',
    language: 'en',
  });
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
  });

  const handleWorkspaceSave = () => {
    // TODO: Implement workspace settings API
    toast({
      title: "Settings saved",
      description: "Your workspace settings have been updated.",
    });
  };

  const handleProfileSave = () => {
    // TODO: Implement profile update API
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleDeleteWorkspace = () => {
    // TODO: Implement workspace deletion API
    toast({
      title: "Workspace deleted",
      description: "Your workspace has been permanently deleted.",
      variant: "destructive",
    });
  };

  return (
    <div className="flex flex-col h-full w-full">
      <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-gray-200 bg-white px-6 py-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-600">Manage your workspace and account</p>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Workspace Settings */}
          <div className="enterprise-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Workspace Settings</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Workspace Name</Label>
                <Input
                  id="workspace-name"
                  value={workspace.name}
                  onChange={(e) => setWorkspace({ ...workspace, name: e.target.value })}
                  className="focus-calm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={workspace.language}
                  onValueChange={(value) => setWorkspace({ ...workspace, language: value })}
                >
                  <SelectTrigger id="language" className="focus-calm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleWorkspaceSave}
                  className="bg-mint-600 hover:bg-mint-700 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>

          {/* Profile Settings */}
          <div className="enterprise-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="focus-calm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="focus-calm"
                />
              </div>

              <div className="border-t border-gray-200 pt-4 mt-6">
                <h3 className="font-medium text-gray-900 mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={profile.currentPassword}
                      onChange={(e) => setProfile({ ...profile, currentPassword: e.target.value })}
                      className="focus-calm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={profile.newPassword}
                      onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
                      className="focus-calm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleProfileSave}
                  className="bg-mint-600 hover:bg-mint-700 text-white"
                >
                  Update Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="enterprise-card p-6 border-red-200">
            <h2 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h2>
            <p className="text-sm text-gray-600 mb-4">
              Once you delete your workspace, there is no going back. Please be certain.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Workspace</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your workspace
                    and remove all associated data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteWorkspace}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Yes, delete workspace
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;