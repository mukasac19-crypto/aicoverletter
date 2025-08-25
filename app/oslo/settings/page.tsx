"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      const response = await fetch('/api/oslo/settings');
      const data = await response.json();
      setSettings(data);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    const response = await fetch('/api/oslo/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (response.ok) {
      toast({
        title: "Settings saved successfully!",
      });
    } else {
      toast({
        title: "Error saving settings",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (category: string, key: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: {
          ...prev[category][key],
          value,
        },
      },
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your application settings</p>
        </div>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>

      <Tabs defaultValue="system">
        <TabsList>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="limits">Limits</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Manage system-wide settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                <Switch
                  id="maintenance-mode"
                  checked={settings.system?.maintenance_mode?.value}
                  onCheckedChange={(checked) => handleInputChange('system', 'maintenance_mode', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="limits">
          <Card>
            <CardHeader>
              <CardTitle>Limits</CardTitle>
              <CardDescription>
                Manage usage limits for different subscription tiers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.limits && Object.keys(settings.limits).map(key => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={key}>{settings.limits[key].description}</Label>
                  <Input
                    id={key}
                    type="number"
                    value={settings.limits[key].value}
                    onChange={(e) => handleInputChange('limits', key, parseInt(e.target.value))}
                    className="w-24"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>
                Manage pricing for different subscription tiers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.pricing && Object.keys(settings.pricing).map(key => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={key}>{settings.pricing[key].description}</Label>
                  <Input
                    id={key}
                    type="number"
                    value={settings.pricing[key].value}
                    onChange={(e) => handleInputChange('pricing', key, parseFloat(e.target.value))}
                    className="w-24"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Manage notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="admin-email-notifications">Admin Email Notifications</Label>
                <Switch
                  id="admin-email-notifications"
                  checked={settings.notifications?.admin_email_notifications?.value}
                  onCheckedChange={(checked) => handleInputChange('notifications', 'admin_email_notifications', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}