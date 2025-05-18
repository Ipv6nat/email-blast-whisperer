
import { useState } from "react";
import { 
  Mail, 
  SendHorizontal, 
  Settings, 
  Users, 
  List, 
  FileText,
  BarChart,
  Save
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface SMTPTransport {
  host: string;
  port: number;
  user: string;
  pass: string;
}

interface ThrottleSettings {
  initial_rate_per_sec: number;
  max_rate_per_sec: number;
  ip_warmup_steps: number[];
}

interface EmailSettings {
  sender_name: string;
  sender_email: string;
  subject: string;
  reply_to: string;
}

const Index = () => {
  // Application state
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  
  // SMTP Settings state
  const [smtpTransports, setSmtpTransports] = useState<SMTPTransport[]>([
    {
      host: "smtp.commufa.jp",
      port: 465,
      user: "jfsx9k3o",
      pass: "933210yg"
    },
    {
      host: "",
      port: 0,
      user: "",
      pass: ""
    }
  ]);

  // Throttle Settings state
  const [throttleSettings, setThrottleSettings] = useState<ThrottleSettings>({
    initial_rate_per_sec: 1,
    max_rate_per_sec: 10,
    ip_warmup_steps: [100, 500, 1000]
  });

  // Email Settings state
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    sender_name: "Acme Corp — Support",
    sender_email: "gotoyoshiaki@qc.commufa.jp",
    subject: "Special Offer Just for You!",
    reply_to: "support@acme.com"
  });

  const [recipientList, setRecipientList] = useState<string>("");
  const [templateContent, setTemplateContent] = useState<string>("");

  // Handlers
  const handleAddTransport = () => {
    setSmtpTransports([...smtpTransports, { host: "", port: 0, user: "", pass: "" }]);
  };

  const handleRemoveTransport = (index: number) => {
    setSmtpTransports(smtpTransports.filter((_, i) => i !== index));
  };

  const handleTransportChange = (index: number, field: keyof SMTPTransport, value: string | number) => {
    const newTransports = [...smtpTransports];
    newTransports[index] = { 
      ...newTransports[index], 
      [field]: value 
    };
    setSmtpTransports(newTransports);
  };

  const handleThrottleChange = (field: keyof ThrottleSettings, value: any) => {
    setThrottleSettings({
      ...throttleSettings,
      [field]: value
    });
  };

  const handleWarmupStepChange = (index: number, value: number) => {
    const newSteps = [...throttleSettings.ip_warmup_steps];
    newSteps[index] = value;
    setThrottleSettings({
      ...throttleSettings,
      ip_warmup_steps: newSteps
    });
  };

  const handleAddWarmupStep = () => {
    setThrottleSettings({
      ...throttleSettings,
      ip_warmup_steps: [...throttleSettings.ip_warmup_steps, 0]
    });
  };

  const handleRemoveWarmupStep = (index: number) => {
    setThrottleSettings({
      ...throttleSettings,
      ip_warmup_steps: throttleSettings.ip_warmup_steps.filter((_, i) => i !== index)
    });
  };

  const handleEmailSettingChange = (field: keyof EmailSettings, value: string) => {
    setEmailSettings({
      ...emailSettings,
      [field]: value
    });
  };

  const handleSaveConfig = () => {
    // In a real app, this would save to a file or API
    const config = {
      smtp_transports: smtpTransports,
      throttle: throttleSettings,
      email_settings: emailSettings
    };
    console.log("Saving config:", config);
    toast.success("Configuration saved successfully!");
  };

  const handleStartCampaign = () => {
    toast.success("Campaign started! Monitoring sending progress...");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Recipients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">No recipients loaded</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">SMTP Servers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{smtpTransports.filter(t => t.host).length}</div>
                  <p className="text-xs text-muted-foreground">Configured and ready</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Send Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{throttleSettings.max_rate_per_sec}/sec</div>
                  <p className="text-xs text-muted-foreground">Maximum send rate</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Status</CardTitle>
                <CardDescription>Start sending emails to your recipients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Template</Label>
                      <div className="text-sm mt-1">{templateContent ? "Loaded" : "Not loaded"}</div>
                    </div>
                    <div>
                      <Label>Recipients</Label>
                      <div className="text-sm mt-1">{recipientList ? recipientList.split("\n").length : 0} addresses</div>
                    </div>
                  </div>
                  <Button 
                    onClick={handleStartCampaign}
                    className="w-full" 
                    disabled={!templateContent || !recipientList}>
                    <SendHorizontal className="mr-2 h-4 w-4" />
                    Start Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case "settings":
        return (
          <Tabs defaultValue="smtp" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="smtp">SMTP Servers</TabsTrigger>
              <TabsTrigger value="throttle">Throttling</TabsTrigger>
              <TabsTrigger value="email">Email Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="smtp" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>SMTP Transport Settings</CardTitle>
                  <CardDescription>Configure your SMTP servers for sending emails</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {smtpTransports.map((transport, index) => (
                      <div key={index} className="space-y-4 border border-gray-200 rounded-md p-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-medium">SMTP Server {index + 1}</h3>
                          {index > 0 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveTransport(index)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`host-${index}`}>Host</Label>
                            <Input 
                              id={`host-${index}`}
                              value={transport.host} 
                              onChange={e => handleTransportChange(index, 'host', e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`port-${index}`}>Port</Label>
                            <Input 
                              id={`port-${index}`}
                              type="number" 
                              value={transport.port} 
                              onChange={e => handleTransportChange(index, 'port', parseInt(e.target.value) || 0)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`user-${index}`}>Username</Label>
                            <Input 
                              id={`user-${index}`}
                              value={transport.user} 
                              onChange={e => handleTransportChange(index, 'user', e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`pass-${index}`}>Password</Label>
                            <Input 
                              id={`pass-${index}`}
                              type="password" 
                              value={transport.pass} 
                              onChange={e => handleTransportChange(index, 'pass', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button variant="outline" onClick={handleAddTransport}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add SMTP Server
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="throttle" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Throttling Settings</CardTitle>
                  <CardDescription>Configure rate limiting and IP warmup settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="initial-rate">Initial Rate (per second)</Label>
                        <Input 
                          id="initial-rate"
                          type="number" 
                          value={throttleSettings.initial_rate_per_sec} 
                          onChange={e => handleThrottleChange('initial_rate_per_sec', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="max-rate">Maximum Rate (per second)</Label>
                        <Input 
                          id="max-rate"
                          type="number" 
                          value={throttleSettings.max_rate_per_sec} 
                          onChange={e => handleThrottleChange('max_rate_per_sec', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <Label>IP Warmup Steps</Label>
                      
                      {throttleSettings.ip_warmup_steps.map((step, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input 
                            type="number" 
                            value={step} 
                            onChange={e => handleWarmupStepChange(index, parseInt(e.target.value) || 0)}
                          />
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveWarmupStep(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                      
                      <Button variant="outline" onClick={handleAddWarmupStep}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Warmup Step
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="email" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Email Settings</CardTitle>
                  <CardDescription>Configure sender information and email metadata</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sender-name">Sender Name</Label>
                      <Input 
                        id="sender-name"
                        value={emailSettings.sender_name} 
                        onChange={e => handleEmailSettingChange('sender_name', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sender-email">Sender Email</Label>
                      <Input 
                        id="sender-email"
                        type="email" 
                        value={emailSettings.sender_email} 
                        onChange={e => handleEmailSettingChange('sender_email', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Email Subject</Label>
                      <Input 
                        id="subject"
                        value={emailSettings.subject} 
                        onChange={e => handleEmailSettingChange('subject', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reply-to">Reply-To Email</Label>
                      <Input 
                        id="reply-to"
                        type="email" 
                        value={emailSettings.reply_to} 
                        onChange={e => handleEmailSettingChange('reply_to', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );
      
      case "recipients":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Recipient List</CardTitle>
              <CardDescription>Enter email addresses (one per line)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <textarea 
                  className="w-full h-80 rounded-md border border-gray-300 p-2 font-mono text-sm"
                  value={recipientList}
                  onChange={(e) => setRecipientList(e.target.value)}
                  placeholder="email@example.com
anotheremail@example.com
..."
                />
                <div className="flex justify-between text-sm">
                  <span>Total recipients: {recipientList.split("\n").filter(Boolean).length}</span>
                  <Button variant="outline" size="sm">Import from CSV</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      case "template":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Email Template</CardTitle>
              <CardDescription>Create your HTML email template with placeholders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <textarea 
                  className="w-full h-80 rounded-md border border-gray-300 p-2 font-mono text-sm code-editor"
                  value={templateContent}
                  onChange={(e) => setTemplateContent(e.target.value)}
                  placeholder="<!DOCTYPE html>
<html>
<head>
  <title>Email Template</title>
</head>
<body>
  <h1>Hello, {{ name }}!</h1>
  <p>This is your personalized content.</p>
</body>
</html>"
                />
                <div className="flex justify-between text-sm">
                  <span>Available placeholders: {{ name }}, {{ email }}</span>
                  <Button variant="outline" size="sm">Load from file</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <SendHorizontal className="h-6 w-6 text-white" />
          <h1 className="text-lg font-bold">Email Blast Whisperer</h1>
        </div>
        
        <div className="space-y-1">
          <button 
            className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md ${activeSection === 'dashboard' ? 'bg-gray-700 text-white' : 'hover:bg-gray-800 text-gray-300'}`}
            onClick={() => setActiveSection('dashboard')}
          >
            <BarChart className="h-4 w-4" />
            Dashboard
          </button>
          
          <button 
            className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md ${activeSection === 'settings' ? 'bg-gray-700 text-white' : 'hover:bg-gray-800 text-gray-300'}`}
            onClick={() => setActiveSection('settings')}
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
          
          <button 
            className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md ${activeSection === 'recipients' ? 'bg-gray-700 text-white' : 'hover:bg-gray-800 text-gray-300'}`}
            onClick={() => setActiveSection('recipients')}
          >
            <Users className="h-4 w-4" />
            Recipients
          </button>
          
          <button 
            className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md ${activeSection === 'template' ? 'bg-gray-700 text-white' : 'hover:bg-gray-800 text-gray-300'}`}
            onClick={() => setActiveSection('template')}
          >
            <FileText className="h-4 w-4" />
            Template
          </button>
        </div>
        
        <div className="mt-auto">
          <Button 
            className="w-full"  
            onClick={handleSaveConfig}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Config
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {activeSection === 'dashboard' && 'Dashboard'}
              {activeSection === 'settings' && 'Settings'}
              {activeSection === 'recipients' && 'Recipients'}
              {activeSection === 'template' && 'Email Template'}
            </h2>
          </div>
          
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
