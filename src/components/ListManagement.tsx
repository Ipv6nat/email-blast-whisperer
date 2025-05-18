
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, RefreshCw, Upload, Download, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface ListManagementProps {
  recipientList: string;
  setRecipientList: (list: string) => void;
}

interface RecipientDetails {
  email: string;
  name?: string;
  valid: boolean;
  reason?: string;
}

const ListManagement = ({ recipientList, setRecipientList }: ListManagementProps) => {
  const [processedList, setProcessedList] = useState<RecipientDetails[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bounceList, setBounceList] = useState<string[]>([]);
  const [complainList, setComplainList] = useState<string[]>([]);
  const [unsubList, setUnsubList] = useState<string[]>([]);

  const validateRecipients = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const recipients = recipientList.split("\n").filter(Boolean);
      const processed: RecipientDetails[] = recipients.map(line => {
        const parts = line.split(",");
        const email = parts[0].trim();
        const name = parts[1]?.trim();
        
        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const valid = emailRegex.test(email);
        const reason = valid ? undefined : "Invalid email format";
        
        return { email, name, valid, reason };
      });
      
      setProcessedList(processed);
      setIsProcessing(false);
      
      const validCount = processed.filter(r => r.valid).length;
      const invalidCount = processed.length - validCount;
      
      toast.success(`Validation complete: ${validCount} valid, ${invalidCount} invalid entries`);
    }, 1000);
  };
  
  const removeInvalidRecipients = () => {
    const validRecipients = processedList
      .filter(r => r.valid)
      .map(r => r.name ? `${r.email},${r.name}` : r.email)
      .join("\n");
    
    setRecipientList(validRecipients);
    toast.success("Removed invalid recipients from the list");
  };
  
  const deduplicate = () => {
    const recipients = recipientList.split("\n").filter(Boolean);
    const uniqueEmails = new Set();
    const uniqueRecipients = recipients.filter(line => {
      const email = line.split(",")[0].trim().toLowerCase();
      if (uniqueEmails.has(email)) {
        return false;
      }
      uniqueEmails.add(email);
      return true;
    });
    
    setRecipientList(uniqueRecipients.join("\n"));
    toast.success(`Deduplication complete: Removed ${recipients.length - uniqueRecipients.length} duplicates`);
  };
  
  const removeSuppressed = () => {
    const allSuppressed = [...bounceList, ...complainList, ...unsubList];
    const recipients = recipientList.split("\n").filter(Boolean);
    
    const cleanedRecipients = recipients.filter(line => {
      const email = line.split(",")[0].trim().toLowerCase();
      return !allSuppressed.includes(email);
    });
    
    setRecipientList(cleanedRecipients.join("\n"));
    toast.success(`Removed ${recipients.length - cleanedRecipients.length} suppressed emails`);
  };
  
  const importSuppressionList = (type: 'bounce' | 'complaint' | 'unsubscribe', list: string) => {
    const emails = list.split("\n")
      .map(line => line.trim())
      .filter(line => line && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(line));
    
    if (type === 'bounce') {
      setBounceList([...bounceList, ...emails]);
    } else if (type === 'complaint') {
      setComplainList([...complainList, ...emails]);
    } else if (type === 'unsubscribe') {
      setUnsubList([...unsubList, ...emails]);
    }
    
    toast.success(`Imported ${emails.length} ${type} addresses`);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>List Management & Hygiene</CardTitle>
        <CardDescription>Clean and validate your recipient list</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Button 
            onClick={validateRecipients} 
            disabled={isProcessing}
            className="flex items-center"
          >
            {isProcessing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
            Validate Recipients
          </Button>
          
          <Button 
            onClick={deduplicate}
            variant="outline"
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Remove Duplicates
          </Button>
          
          <Button
            onClick={removeSuppressed}
            variant="outline" 
            className="flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove Suppressed
          </Button>
        </div>
        
        <Tabs defaultValue="validation">
          <TabsList className="mb-4">
            <TabsTrigger value="validation">Validation Results</TabsTrigger>
            <TabsTrigger value="suppression">Suppression Lists</TabsTrigger>
          </TabsList>
          
          <TabsContent value="validation">
            {processedList.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b grid grid-cols-12 font-medium text-sm">
                  <div className="col-span-5">Email</div>
                  <div className="col-span-3">Name</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Reason</div>
                </div>
                <div className="max-h-56 overflow-y-auto">
                  {processedList.map((recipient, index) => (
                    <div key={index} className="px-4 py-2 border-b last:border-0 grid grid-cols-12 text-sm">
                      <div className="col-span-5 truncate">{recipient.email}</div>
                      <div className="col-span-3 truncate">{recipient.name || "-"}</div>
                      <div className="col-span-2">
                        {recipient.valid ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Valid
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Invalid
                          </Badge>
                        )}
                      </div>
                      <div className="col-span-2 text-gray-500 truncate">{recipient.reason || "-"}</div>
                    </div>
                  ))}
                </div>
                {processedList.some(r => !r.valid) && (
                  <div className="bg-gray-50 px-4 py-2 border-t">
                    <Button size="sm" onClick={removeInvalidRecipients}>
                      Remove Invalid Recipients
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p>No validation results yet. Click "Validate Recipients" to check your list.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="suppression">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-medium mb-2">Bounce List</h3>
                <p className="text-sm text-gray-500 mb-2">{bounceList.length} addresses</p>
                <Textarea 
                  className="h-32"
                  placeholder="Enter email addresses, one per line"
                  value={bounceList.join("\n")}
                  onChange={(e) => setBounceList(e.target.value.split("\n").filter(Boolean))}
                />
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => importSuppressionList('bounce', '')}>
                    <Upload className="h-4 w-4 mr-1" /> Import
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" /> Export
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Complaint List</h3>
                <p className="text-sm text-gray-500 mb-2">{complainList.length} addresses</p>
                <Textarea 
                  className="h-32"
                  placeholder="Enter email addresses, one per line"
                  value={complainList.join("\n")}
                  onChange={(e) => setComplainList(e.target.value.split("\n").filter(Boolean))}
                />
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => importSuppressionList('complaint', '')}>
                    <Upload className="h-4 w-4 mr-1" /> Import
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" /> Export
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Unsubscribe List</h3>
                <p className="text-sm text-gray-500 mb-2">{unsubList.length} addresses</p>
                <Textarea 
                  className="h-32"
                  placeholder="Enter email addresses, one per line"
                  value={unsubList.join("\n")}
                  onChange={(e) => setUnsubList(e.target.value.split("\n").filter(Boolean))}
                />
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => importSuppressionList('unsubscribe', '')}>
                    <Upload className="h-4 w-4 mr-1" /> Import
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" /> Export
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ListManagement;
