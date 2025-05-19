import { useState } from "react";
import { 
  Mail, 
  SendHorizontal, 
  Settings, 
  Users, 
  List, 
  FileText,
  BarChart,
  Save,
  Trash2,
  PlusCircle,
  LineChart,
  Shield,
  CheckSquare
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import EmailAnalytics from "@/components/EmailAnalytics";
import ListManagement from "@/components/ListManagement";
import SpamScoreChecker from "@/components/SpamScoreChecker";
import TrackingOptions, { TrackingSettings } from "@/components/TrackingOptions";

// Type definitions
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

interface SSHSettings {
  enabled: boolean;
  host: string;
  port: number;
  username: string;
  password: string;
  key_path: string;
  use_key: boolean;
}

interface WebhookSettings {
  enabled: boolean;
  bounce_url: string;
  complaint_url: string;
}

// Available placeholders for email templates
const PLACEHOLDERS = {
  "RECIPIENT_NAME": "Recipient's name or first part of email",
  "RECIPIENT_EMAIL": "Recipient's email address",
  "RECIPIENT_DOMAIN": "Domain part of recipient's email",
  "CURRENT_DATE": "Current date in ISO format",
  "CURRENT_TIME": "Current time in ISO format",
  "RANDOM_NUMBER10": "Random 10-digit number",
  "RANDOM_STRING": "Random 12-character string",
  "RANDOM_MD5": "Random MD5 hash",
  "FAKE_COMPANY": "Random company name",
  "FAKE_COMPANY_EMAIL": "Random company email",
  "FAKE_COMPANY_EMAIL_AND_FULLNAME": "Random name with company email",
  "RANDOM_PATH": "Random URL path",
  "RECIPIENT_BASE64_EMAIL": "Base64 encoded recipient email",
  "RANDOMLINK": "Random URL"
};

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

  // SSH Settings state
  const [sshSettings, setSSHSettings] = useState<SSHSettings>({
    enabled: false,
    host: "",
    port: 22,
    username: "",
    password: "",
    key_path: "",
    use_key: false
  });

  // Webhook Settings state
  const [webhookSettings, setWebhookSettings] = useState<WebhookSettings>({
    enabled: false,
    bounce_url: "http://localhost:8000/webhook/bounce",
    complaint_url: "http://localhost:8000/webhook/complaint"
  });

  // Analytics mock data
  const [analyticsData, setAnalyticsData] = useState({
    sentCount: 1250,
    openCount: 875,
    clickCount: 320,
    bounceCount: 25,
    complaintCount: 3
  });

  // Tracking settings
  const [trackingSettings, setTrackingSettings] = useState<TrackingSettings>({
    enableOpenTracking: true,
    enableClickTracking: true,
    trackingDomain: "track.yourdomain.com",
    customTrackingParams: "utm_source=newsletter&utm_medium=email",
    unsubscribeEnabled: true,
    unsubscribeText: "If you would like to unsubscribe from these emails, click here: {{unsubscribe_link}}"
  });

  const [recipientList, setRecipientList] = useState<string>("");
  const [templateContent, setTemplateContent] = useState<string>("");
  const [showPlaceholders, setShowPlaceholders] = useState<boolean>(false);

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

  const handleSSHSettingChange = (field: keyof SSHSettings, value: any) => {
    setSSHSettings({
      ...sshSettings,
      [field]: value
    });
  };

  const handleWebhookSettingChange = (field: keyof WebhookSettings, value: any) => {
    setWebhookSettings({
      ...webhookSettings,
      [field]: value
    });
  };

  const handleSaveConfig = () => {
    // In a real app, this would save to a file or API
    const config = {
      smtp_transports: smtpTransports,
      throttle: throttleSettings,
      email_settings: emailSettings,
      ssh_settings: sshSettings,
      webhook_settings: webhookSettings,
      tracking_settings: trackingSettings
    };
    console.log("Saving config:", config);
    toast.success("Configuration saved successfully!");
  };

  const handleStartCampaign = () => {
    toast.success("Campaign started!");
  };

  // Helper function to insert placeholder
  const insertPlaceholder = (placeholder: string) => {
    const updatedContent = templateContent + `{{${placeholder}}}`;
    setTemplateContent(updatedContent);
  };

  const handleTrackingChange = (settings: TrackingSettings) => {
    setTrackingSettings(settings);
  };
  
  const handleTemplateChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTemplateContent(e.target.value);
  };
  
  const handleTemplatePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text');
    // We don't prevent default to allow normal paste operation
    // This ensures the paste works properly
    
    // Store the value in a variable before the setTimeout
    const inputValue = e.currentTarget.value;
    
    // Update with the new pasted content
    setTimeout(() => {
      // Get the updated value after paste operation is complete
      const textareaElement = e.currentTarget;
      if (textareaElement) {
        setTemplateContent(textareaElement.value);
      } else {
        // Fallback if currentTarget is null
        setTemplateContent(inputValue + pastedText);
      }
    }, 0);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-16 bg-white shadow-md flex flex-col items-center py-4">
        <div className="text-sm font-bold mb-4 text-center text-red-600 -rotate-90">RAISE HELL</div>
        <button
          className={`p-3 rounded-lg mb-4 ${activeSection === "dashboard" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
          onClick={() => setActiveSection("dashboard")}
        >
          <BarChart className="h-6 w-6" />
        </button>
        <button
          className={`p-3 rounded-lg mb-4 ${activeSection === "recipients" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
          onClick={() => setActiveSection("recipients")}
        >
          <Users className="h-6 w-6" />
        </button>
        <button
          className={`p-3 rounded-lg mb-4 ${activeSection === "templates" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
          onClick={() => setActiveSection("templates")}
        >
          <FileText className="h-6 w-6" />
        </button>
        <button
          className={`p-3 rounded-lg mb-4 ${activeSection === "quality" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
          onClick={() => setActiveSection("quality")}
        >
          <CheckSquare className="h-6 w-6" />
        </button>
        <button
          className={`p-3 rounded-lg mb-4 ${activeSection === "tracking" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
          onClick={() => setActiveSection("tracking")}
        >
          <LineChart className="h-6 w-6" />
        </button>
        <button
          className={`p-3 rounded-lg mb-4 ${activeSection === "settings" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
          onClick={() => setActiveSection("settings")}
        >
          <Settings className="h-6 w-6" />
        </button>
        <button
          className={`p-3 rounded-lg mt-auto ${activeSection === "send" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
          onClick={() => setActiveSection("send")}
        >
          <SendHorizontal className="h-6 w-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Dashboard */}
        {activeSection === "dashboard" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ready to Send</CardTitle>
                  <CardDescription>SMTP servers ready</CardDescription>
                </CardHeader>
                <CardContent className="text-4xl font-bold">
                  {smtpTransports.filter(t => t.host).length}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recipients</CardTitle>
                  <CardDescription>Total email recipients</CardDescription>
                </CardHeader>
                <CardContent className="text-4xl font-bold">
                  {recipientList.split("\n").filter(Boolean).length}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                  <CardDescription>Current campaign status</CardDescription>
                </CardHeader>
                <CardContent className="text-4xl font-bold text-blue-600">
                  Ready
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8">
              <EmailAnalytics 
                sentCount={analyticsData.sentCount}
                openCount={analyticsData.openCount}
                clickCount={analyticsData.clickCount}
                bounceCount={analyticsData.bounceCount}
                complaintCount={analyticsData.complaintCount}
              />
            </div>
          </div>
        )}

        {/* Recipients */}
        {activeSection === "recipients" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Recipients</h1>
            <Card>
              <CardHeader>
                <CardTitle>Email List</CardTitle>
                <CardDescription>One recipient per line. Format: email,name (name is optional)</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={recipientList}
                  onChange={(e) => setRecipientList(e.target.value)}
                  placeholder="john@example.com,John Smith&#10;alice@example.com,Alice Johnson"
                  className="min-h-[300px] font-mono"
                />
                <div className="mt-4 flex justify-between">
                  <span className="text-sm text-gray-500">
                    {recipientList.split("\n").filter(Boolean).length} recipients
                  </span>
                  <Button variant="outline">Import CSV</Button>
                </div>
              </CardContent>
            </Card>
            
            <ListManagement 
              recipientList={recipientList}
              setRecipientList={setRecipientList}
            />
          </div>
        )}

        {/* Templates */}
        {activeSection === "templates" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Email Templates</h1>
            <Card>
              <CardHeader>
                <CardTitle>HTML Template</CardTitle>
                <CardDescription>Use placeholders surrounded by double curly braces</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowPlaceholders(!showPlaceholders)}
                  >
                    {showPlaceholders ? "Hide Placeholders" : "Show Available Placeholders"}
                  </Button>
                  
                  {showPlaceholders && (
                    <div className="mt-4 p-4 border rounded-md bg-gray-50">
                      <h3 className="font-semibold mb-2">Click to insert:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {Object.entries(PLACEHOLDERS).map(([key, description]) => (
                          <Button 
                            key={key} 
                            variant="ghost" 
                            size="sm"
                            className="justify-start text-xs"
                            onClick={() => insertPlaceholder(key)}
                          >
                            {key}
                            <span className="ml-2 text-gray-500 truncate max-w-[150px]">
                              {description}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Textarea
                  value={templateContent}
                  onChange={handleTemplateChange}
                  onPaste={handleTemplatePaste}
                  placeholder="<!DOCTYPE html>
<html>
<head>
  <title>Email Template</title>
</head>
<body>
  <h1>Hello, {{RECIPIENT_NAME}}!</h1>
  <p>This is your personalized content.</p>
</body>
</html>"
                  className="min-h-[300px] font-mono"
                />
                <div className="flex justify-between text-sm mt-2">
                  <span>Use any of the available placeholders in your template</span>
                  <Button variant="outline" size="sm">Load from file</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Quality Check */}
        {activeSection === "quality" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Email Quality</h1>
            <SpamScoreChecker 
              templateContent={templateContent}
              emailSubject={emailSettings.subject}
            />
          </div>
        )}
        
        {/* Tracking */}
        {activeSection === "tracking" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Engagement Tracking</h1>
            <TrackingOptions onTrackingChange={handleTrackingChange} />
          </div>
        )}

        {/* Settings */}
        {activeSection === "settings" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Settings</h1>

            <Tabs defaultValue="smtp">
              <TabsList className="mb-4">
                <TabsTrigger value="smtp">SMTP Servers</TabsTrigger>
                <TabsTrigger value="throttle">Throttling</TabsTrigger>
                <TabsTrigger value="email">Email Settings</TabsTrigger>
                <TabsTrigger value="ssh">Remote SSH</TabsTrigger>
                <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
              </TabsList>

              {/* SMTP Servers Tab */}
              <TabsContent value="smtp">
                <Card>
                  <CardHeader>
                    <CardTitle>SMTP Transport Settings</CardTitle>
                    <CardDescription>Configure your SMTP servers for sending emails</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {smtpTransports.map((transport, index) => (
                      <div key={index} className="mb-6 p-4 border rounded-md bg-gray-50">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-bold">Server #{index + 1}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTransport(index)}
                            disabled={index === 0}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`host-${index}`}>Host</Label>
                            <Input
                              id={`host-${index}`}
                              value={transport.host}
                              onChange={(e) => handleTransportChange(index, "host", e.target.value)}
                              placeholder="smtp.example.com"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`port-${index}`}>Port</Label>
                            <Input
                              id={`port-${index}`}
                              type="number"
                              value={transport.port || ""}
                              onChange={(e) => handleTransportChange(index, "port", parseInt(e.target.value) || 0)}
                              placeholder="587"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`user-${index}`}>Username</Label>
                            <Input
                              id={`user-${index}`}
                              value={transport.user}
                              onChange={(e) => handleTransportChange(index, "user", e.target.value)}
                              placeholder="username"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`pass-${index}`}>Password</Label>
                            <Input
                              id={`pass-${index}`}
                              type="password"
                              value={transport.pass}
                              onChange={(e) => handleTransportChange(index, "pass", e.target.value)}
                              placeholder="password"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" onClick={handleAddTransport}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add SMTP Server
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Throttling Tab */}
              <TabsContent value="throttle">
                <Card>
                  <CardHeader>
                    <CardTitle>Throttling Settings</CardTitle>
                    <CardDescription>Configure sending rate and IP warming</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="initial_rate">Initial Rate (emails/sec)</Label>
                        <Input
                          id="initial_rate"
                          type="number"
                          value={throttleSettings.initial_rate_per_sec}
                          onChange={(e) => handleThrottleChange("initial_rate_per_sec", Number(e.target.value))}
                          min="0.1"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="max_rate">Maximum Rate (emails/sec)</Label>
                        <Input
                          id="max_rate"
                          type="number"
                          value={throttleSettings.max_rate_per_sec}
                          onChange={(e) => handleThrottleChange("max_rate_per_sec", Number(e.target.value))}
                          min="0.1"
                          step="0.1"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="font-semibold mb-3">IP Warmup Steps</h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Define how many emails to send before increasing the sending rate
                      </p>
                      {throttleSettings.ip_warmup_steps.map((step, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <Input
                            type="number"
                            value={step}
                            onChange={(e) => handleWarmupStepChange(index, parseInt(e.target.value) || 0)}
                            className="w-32"
                            min="1"
                          />
                          <span className="mx-3 text-gray-500">emails</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveWarmupStep(index)}
                            disabled={throttleSettings.ip_warmup_steps.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={handleAddWarmupStep}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Step
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Email Settings Tab */}
              <TabsContent value="email">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Configuration</CardTitle>
                    <CardDescription>Configure sender information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="sender_name">Sender Name</Label>
                        <Input
                          id="sender_name"
                          value={emailSettings.sender_name}
                          onChange={(e) => handleEmailSettingChange("sender_name", e.target.value)}
                          placeholder="Acme Corp — Support"
                        />
                      </div>
                      <div>
                        <Label htmlFor="sender_email">Sender Email</Label>
                        <Input
                          id="sender_email"
                          value={emailSettings.sender_email}
                          onChange={(e) => handleEmailSettingChange("sender_email", e.target.value)}
                          placeholder="support@acme.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject">Email Subject</Label>
                        <Input
                          id="subject"
                          value={emailSettings.subject}
                          onChange={(e) => handleEmailSettingChange("subject", e.target.value)}
                          placeholder="Special Offer Just for You!"
                        />
                      </div>
                      <div>
                        <Label htmlFor="reply_to">Reply-To Email</Label>
                        <Input
                          id="reply_to"
                          value={emailSettings.reply_to}
                          onChange={(e) => handleEmailSettingChange("reply_to", e.target.value)}
                          placeholder="replies@acme.com"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SSH Settings Tab */}
              <TabsContent value="ssh">
                <Card>
                  <CardHeader>
                    <CardTitle>Remote SSH Configuration</CardTitle>
                    <CardDescription>Configure SSH for remote execution of email sending</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                      <Switch
                        id="ssh-enabled"
                        checked={sshSettings.enabled}
                        onCheckedChange={(checked) => handleSSHSettingChange("enabled", checked)}
                      />
                      <Label htmlFor="ssh-enabled">Enable SSH Remote Execution</Label>
                    </div>
                    
                    {sshSettings.enabled && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="ssh_host">SSH Host</Label>
                            <Input
                              id="ssh_host"
                              value={sshSettings.host}
                              onChange={(e) => handleSSHSettingChange("host", e.target.value)}
                              placeholder="example.com or IP address"
                            />
                          </div>
                          <div>
                            <Label htmlFor="ssh_port">SSH Port</Label>
                            <Input
                              id="ssh_port"
                              type="number"
                              value={sshSettings.port}
                              onChange={(e) => handleSSHSettingChange("port", parseInt(e.target.value) || 22)}
                              placeholder="22"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="ssh_username">Username</Label>
                          <Input
                            id="ssh_username"
                            value={sshSettings.username}
                            onChange={(e) => handleSSHSettingChange("username", e.target.value)}
                            placeholder="root"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          <Switch
                            id="ssh-key-auth"
                            checked={sshSettings.use_key}
                            onCheckedChange={(checked) => handleSSHSettingChange("use_key", checked)}
                          />
                          <Label htmlFor="ssh-key-auth">Use SSH Key Authentication</Label>
                        </div>
                        
                        {sshSettings.use_key ? (
                          <div>
                            <Label htmlFor="ssh_key_path">SSH Key Path</Label>
                            <Input
                              id="ssh_key_path"
                              value={sshSettings.key_path}
                              onChange={(e) => handleSSHSettingChange("key_path", e.target.value)}
                              placeholder="/path/to/private_key"
                            />
                          </div>
                        ) : (
                          <div>
                            <Label htmlFor="ssh_password">Password</Label>
                            <Input
                              id="ssh_password"
                              type="password"
                              value={sshSettings.password}
                              onChange={(e) => handleSSHSettingChange("password", e.target.value)}
                              placeholder="SSH password"
                            />
                          </div>
                        )}
                        
                        <div className="mt-4 p-4 bg-gray-50 rounded-md border">
                          <h4 className="font-semibold mb-2">Note:</h4>
                          <p className="text-sm text-gray-600">
                            When enabled, the application will execute the email sending script via SSH on the remote server.
                            Make sure the remote server has all required dependencies installed.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Webhooks Tab */}
              <TabsContent value="webhooks">
                <Card>
                  <CardHeader>
                    <CardTitle>Webhook Configuration</CardTitle>
                    <CardDescription>Configure webhooks for bounce and complaint handling</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                      <Switch
                        id="webhook-enabled"
                        checked={webhookSettings.enabled}
                        onCheckedChange={(checked) => handleWebhookSettingChange("enabled", checked)}
                      />
                      <Label htmlFor="webhook-enabled">Enable Webhooks</Label>
                    </div>
                    
                    {webhookSettings.enabled && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="bounce_webhook">Bounce Webhook URL</Label>
                          <Input
                            id="bounce_webhook"
                            value={webhookSettings.bounce_url}
                            onChange={(e) => handleWebhookSettingChange("bounce_url", e.target.value)}
                            placeholder="http://your-server.com/webhook/bounce"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="complaint_webhook">Complaint Webhook URL</Label>
                          <Input
                            id="complaint_webhook"
                            value={webhookSettings.complaint_url}
                            onChange={(e) => handleWebhookSettingChange("complaint_url", e.target.value)}
                            placeholder="http://your-server.com/webhook/complaint"
                          />
                        </div>
                        
                        <div className="mt-4 p-4 bg-gray-50 rounded-md border">
                          <h4 className="font-semibold mb-2">Sample Flask Webhook Server:</h4>
                          <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
{`from flask import Flask, request
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

@app.route("/webhook/bounce", methods=["POST"])
def bounce_webhook():
    data = request.get_json()
    email = data.get("recipient")
    logging.info(f"Bounce received for {email}")
    return "OK", 200

@app.route("/webhook/complaint", methods=["POST"])
def complaint_webhook():
    data = request.get_json()
    email = data.get("recipient")
    logging.info(f"Complaint received for {email}")
    return "OK", 200

if __name__ == "__main__":
    # Flask's built-in server is fine for low-volume webhooks
    app.run(port=8000)`}
                          </pre>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <Button onClick={handleSaveConfig}>
                <Save className="h-4 w-4 mr-2" />
                Save Configuration
              </Button>
            </div>
          </div>
        )}

        {/* Send */}
        {activeSection === "send" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Send Campaign</h1>
            <Card>
              <CardHeader>
                <CardTitle>Start Sending</CardTitle>
                <CardDescription>Review and launch your email campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-1">SMTP Servers:</h3>
                      <p className="text-sm">{smtpTransports.filter(t => t.host).length} configured</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Recipients:</h3>
                      <p className="text-sm">{recipientList.split("\n").filter(Boolean).length} recipients</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">From:</h3>
                      <p className="text-sm">{emailSettings.sender_name} &lt;{emailSettings.sender_email}&gt;</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Subject:</h3>
                      <p className="text-sm">{emailSettings.subject}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Tracking:</h3>
                      <p className="text-sm">
                        {trackingSettings.enableOpenTracking ? "Opens, " : ""}
                        {trackingSettings.enableClickTracking ? "Clicks, " : ""}
                        {trackingSettings.unsubscribeEnabled ? "Unsubscribes" : ""}
                        {!trackingSettings.enableOpenTracking && !trackingSettings.enableClickTracking && !trackingSettings.unsubscribeEnabled && "None"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-1">Template Preview:</h3>
                    <div className="p-4 border rounded-md bg-gray-50 max-h-40 overflow-auto">
                      {templateContent ? (
                        <pre className="text-xs overflow-x-auto">{templateContent}</pre>
                      ) : (
                        <p className="text-gray-400 italic">No template content</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      onClick={handleStartCampaign} 
                      disabled={
                        !smtpTransports.some(t => t.host) || 
                        !recipientList.trim() || 
                        !templateContent.trim()
                      }
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <SendHorizontal className="h-4 w-4 mr-2" />
                      Start Campaign
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
