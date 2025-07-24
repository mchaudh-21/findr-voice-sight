import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LogOut, User, Bell, Shield, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();

  const handleSignOut = () => {
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    onOpenChange(false);
  };

  const settingsOptions = [
    {
      icon: User,
      label: 'Profile Settings',
      description: 'Manage your account information',
      action: () => toast({ title: "Profile Settings", description: "Coming soon!" }),
    },
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Configure your notification preferences',
      action: () => toast({ title: "Notifications", description: "Coming soon!" }),
    },
    {
      icon: Shield,
      label: 'Privacy & Security',
      description: 'Manage your privacy settings',
      action: () => toast({ title: "Privacy & Security", description: "Coming soon!" }),
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'Get help and contact support',
      action: () => toast({ title: "Help & Support", description: "Coming soon!" }),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby="settings-description">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <div id="settings-description" className="sr-only">
          Configure your account settings and preferences
        </div>

        <div className="space-y-1">
          {settingsOptions.map((option, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start h-auto p-4"
              onClick={option.action}
              aria-label={option.label}
            >
              <option.icon className="h-5 w-5 mr-3 flex-shrink-0" />
              <div className="text-left">
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-muted-foreground">{option.description}</div>
              </div>
            </Button>
          ))}
        </div>

        <Separator className="my-4" />

        <Button
          variant="outline"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={handleSignOut}
          aria-label="Sign out of your account"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </DialogContent>
    </Dialog>
  );
};