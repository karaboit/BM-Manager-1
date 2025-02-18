import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Settings, Shield, Boxes } from "lucide-react";

interface ConfigPanelProps {
  onSave?: () => void;
  initialSettings?: {
    siteName: string;
    maintenanceMode: boolean;
    emailNotifications: boolean;
    maxLoginAttempts: number;
    sessionTimeout: number;
    modules: {
      userManagement: boolean;
      maintenance: boolean;
      announcements: boolean;
    };
  };
}

const ConfigPanel = ({
  onSave = () => {
    // Here you would typically make an API call to save the settings
    console.log("Saving settings...");
  },
  initialSettings = {
    siteName: "Boarding House Management System",
    maintenanceMode: false,
    emailNotifications: true,
    maxLoginAttempts: 3,
    sessionTimeout: 30,
    modules: {
      userManagement: true,
      maintenance: true,
      announcements: true,
    },
  },
}: ConfigPanelProps) => {
  return (
    <div className="p-6 bg-background w-full min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">System Configuration</h1>
        <p className="text-muted-foreground">
          Manage system-wide settings and configurations
        </p>
      </div>

      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3">
          <TabsTrigger value="global">
            <Settings className="w-4 h-4 mr-2" />
            Global
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="modules">
            <Boxes className="w-4 h-4 mr-2" />
            Modules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global">
          <Card>
            <CardHeader>
              <CardTitle>Global Settings</CardTitle>
              <CardDescription>Configure system-wide settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  defaultValue={initialSettings.siteName}
                  placeholder="Enter site name"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Disable access to the system for maintenance
                  </p>
                </div>
                <Switch
                  checked={initialSettings.maintenanceMode}
                  onCheckedChange={() => {}}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable system email notifications
                  </p>
                </div>
                <Switch
                  checked={initialSettings.emailNotifications}
                  onCheckedChange={() => {}}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Policies</CardTitle>
              <CardDescription>
                Configure security settings and policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  defaultValue={initialSettings.maxLoginAttempts}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">
                  Session Timeout (minutes)
                </Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  defaultValue={initialSettings.sessionTimeout}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules">
          <Card>
            <CardHeader>
              <CardTitle>Module Management</CardTitle>
              <CardDescription>
                Enable or disable system modules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>User Management</Label>
                  <p className="text-sm text-muted-foreground">
                    User and role management functionality
                  </p>
                </div>
                <Switch
                  checked={initialSettings.modules.userManagement}
                  onCheckedChange={() => {}}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Tools</Label>
                  <p className="text-sm text-muted-foreground">
                    System maintenance and backup tools
                  </p>
                </div>
                <Switch
                  checked={initialSettings.modules.maintenance}
                  onCheckedChange={() => {}}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Announcements</Label>
                  <p className="text-sm text-muted-foreground">
                    System-wide announcement functionality
                  </p>
                </div>
                <Switch
                  checked={initialSettings.modules.announcements}
                  onCheckedChange={() => {}}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end space-x-4">
        <Button variant="outline">Cancel</Button>
        <Button onClick={onSave}>Save Changes</Button>
      </div>
    </div>
  );
};

export default ConfigPanel;
