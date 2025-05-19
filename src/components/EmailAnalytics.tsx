
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface EmailAnalyticProps {
  sentCount: number;
  openCount: number;
  clickCount: number;
  bounceCount: number;
  complaintCount: number;
}

const EmailAnalytics = ({
  sentCount,
  openCount,
  clickCount,
  bounceCount,
  complaintCount
}: EmailAnalyticProps) => {
  const openRate = sentCount > 0 ? Math.round((openCount / sentCount) * 100) : 0;
  const clickRate = openCount > 0 ? Math.round((clickCount / openCount) * 100) : 0;
  const bounceRate = sentCount > 0 ? Math.round((bounceCount / sentCount) * 100) : 0;
  const complaintRate = sentCount > 0 ? Math.round((complaintCount / sentCount) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Analytics</CardTitle>
        <CardDescription>Track how recipients interact with your emails</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Open Rate</span>
            <span className="text-sm font-medium">{openRate}%</span>
          </div>
          <Progress value={openRate} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">{openCount} of {sentCount} emails opened</p>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Click Rate</span>
            <span className="text-sm font-medium">{clickRate}%</span>
          </div>
          <Progress value={clickRate} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">{clickCount} clicks from {openCount} opened emails</p>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Bounce Rate</span>
            <span className="text-sm font-medium">{bounceRate}%</span>
          </div>
          <Progress value={bounceRate} className="h-2 bg-red-100" />
          <p className="text-xs text-gray-500 mt-1">{bounceCount} of {sentCount} emails bounced</p>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Complaint Rate</span>
            <span className="text-sm font-medium">{complaintRate}%</span>
          </div>
          <Progress value={complaintRate} className="h-2 bg-red-100" />
          <p className="text-xs text-gray-500 mt-1">{complaintCount} of {sentCount} emails received complaints</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailAnalytics;
