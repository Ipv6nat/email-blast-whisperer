
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Info, Copy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";

interface TrackingOptionsProps {
  onTrackingChange: (tracking: TrackingSettings) => void;
}

export interface TrackingSettings {
  enableOpenTracking: boolean;
  enableClickTracking: boolean;
  trackingDomain: string;
  customTrackingParams: string;
  unsubscribeEnabled: boolean;
  unsubscribeText: string;
}

const TrackingOptions = ({ onTrackingChange }: TrackingOptionsProps) => {
  const [trackingSettings, setTrackingSettings] = useState<TrackingSettings>({
    enableOpenTracking: true,
    enableClickTracking: true,
    trackingDomain: "track.yourdomain.com",
    customTrackingParams: "utm_source=newsletter&utm_medium=email",
    unsubscribeEnabled: true,
    unsubscribeText: "If you would like to unsubscribe from these emails, click here: {{unsubscribe_link}}"
  });

  const updateSettings = (key: keyof TrackingSettings, value: any) => {
    const newSettings = { ...trackingSettings, [key]: value };
    setTrackingSettings(newSettings);
    onTrackingChange(newSettings);
  };

  const copyTrackingCode = () => {
    const trackingPixel = `<img src="https://${trackingSettings.trackingDomain}/open?id={{RECIPIENT_BASE64_EMAIL}}" width="1" height="1" />`;
    navigator.clipboard.writeText(trackingPixel);
    toast.success("Tracking pixel code copied to clipboard");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Tracking</CardTitle>
        <CardDescription>Configure email tracking and engagement options</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tracking">
          <TabsList className="mb-4">
            <TabsTrigger value="tracking">Tracking Options</TabsTrigger>
            <TabsTrigger value="unsubscribe">Unsubscribe Management</TabsTrigger>
            <TabsTrigger value="code">Tracking Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tracking">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="open-tracking">Open Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Track when recipients open your email
                  </p>
                </div>
                <Switch
                  id="open-tracking"
                  checked={trackingSettings.enableOpenTracking}
                  onCheckedChange={(checked) => updateSettings('enableOpenTracking', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="click-tracking">Click Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Track when recipients click links in your email
                  </p>
                </div>
                <Switch
                  id="click-tracking"
                  checked={trackingSettings.enableClickTracking}
                  onCheckedChange={(checked) => updateSettings('enableClickTracking', checked)}
                />
              </div>
              
              <Separator />
              
              <div>
                <Label htmlFor="tracking-domain">Tracking Domain</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Domain used for tracking links and opens
                </p>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                      <span className="text-muted-foreground">https://</span>
                      <input
                        className="flex-1 border-0 bg-transparent p-0 outline-none ml-1"
                        id="tracking-domain"
                        value={trackingSettings.trackingDomain}
                        onChange={(e) => updateSettings('trackingDomain', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="utm-params">UTM Parameters</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Custom tracking parameters added to all links
                </p>
                <Textarea
                  id="utm-params"
                  value={trackingSettings.customTrackingParams}
                  onChange={(e) => updateSettings('customTrackingParams', e.target.value)}
                  placeholder="utm_source=newsletter&utm_medium=email&utm_campaign=welcome"
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="unsubscribe">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-unsubscribe">Add Unsubscribe Link</Label>
                  <p className="text-sm text-muted-foreground">
                    Include an unsubscribe link in your emails (recommended)
                  </p>
                </div>
                <Switch
                  id="enable-unsubscribe"
                  checked={trackingSettings.unsubscribeEnabled}
                  onCheckedChange={(checked) => updateSettings('unsubscribeEnabled', checked)}
                />
              </div>
              
              {trackingSettings.unsubscribeEnabled && (
                <>
                  <Separator />
                  
                  <div>
                    <Label htmlFor="unsubscribe-text">Unsubscribe Text</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Text that will appear with the unsubscribe link
                    </p>
                    <Textarea
                      id="unsubscribe-text"
                      value={trackingSettings.unsubscribeText}
                      onChange={(e) => updateSettings('unsubscribeText', e.target.value)}
                      className="min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground mt-2 flex items-center">
                      <Info className="h-3 w-3 mr-1" />
                      Use {{unsubscribe_link}} as a placeholder for the unsubscribe URL
                    </p>
                  </div>
                  
                  <div className="rounded-md border p-4 bg-muted/50">
                    <h4 className="font-medium mb-2">Why Unsubscribe Links Matter</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-5">
                      <li>Required by anti-spam laws in many countries (CAN-SPAM, GDPR)</li>
                      <li>Improves sender reputation and deliverability rates</li>
                      <li>Reduces spam complaints when recipients can easily opt out</li>
                      <li>Maintains a higher-quality, engaged subscriber list</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="code">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Tracking Pixel</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Add this invisible pixel to your email template to track opens
                </p>
                <div className="relative">
                  <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                    {`<img src="https://${trackingSettings.trackingDomain}/open?id={{RECIPIENT_BASE64_EMAIL}}" width="1" height="1" />`}
                  </pre>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={copyTrackingCode}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Link Tracking Format</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  How your links will be transformed for click tracking
                </p>
                <div className="bg-muted p-3 rounded-md text-xs">
                  <div className="mb-2">
                    <span className="text-muted-foreground">Original:</span> 
                    <code className="ml-2">https://example.com/page</code>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tracked:</span> 
                    <code className="ml-2">
                      https://{trackingSettings.trackingDomain}/click?url=https%3A%2F%2Fexample.com%2Fpage&id={{RECIPIENT_BASE64_EMAIL}}
                      {trackingSettings.customTrackingParams ? `&${trackingSettings.customTrackingParams}` : ''}
                    </code>
                  </div>
                </div>
              </div>
              
              {trackingSettings.unsubscribeEnabled && (
                <div>
                  <h3 className="font-medium mb-2">Unsubscribe Link Format</h3>
                  <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                    {`https://${trackingSettings.trackingDomain}/unsubscribe?email={{RECIPIENT_EMAIL}}&hash={{RECIPIENT_MD5}}`}
                  </pre>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TrackingOptions;
