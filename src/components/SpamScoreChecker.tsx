
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, AlertCircle, AlertTriangle, RefreshCw } from "lucide-react";

interface SpamCheckerProps {
  templateContent: string;
  emailSubject: string;
}

interface SpamRule {
  id: string;
  name: string;
  description: string;
  isPassing: boolean;
  severity: 'high' | 'medium' | 'low';
}

const SpamScoreChecker = ({ templateContent, emailSubject }: SpamCheckerProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [spamScore, setSpamScore] = useState<number | null>(null);
  const [rules, setRules] = useState<SpamRule[]>([]);
  
  const checkSpamScore = () => {
    setIsChecking(true);
    
    // Simulating API call
    setTimeout(() => {
      const content = templateContent.toLowerCase();
      const subject = emailSubject.toLowerCase();
      
      // Sample rules - in a real app these would come from SpamAssassin or similar
      const generatedRules: SpamRule[] = [
        {
          id: 'html_ratio',
          name: 'HTML to text ratio',
          description: 'Your email has a good balance of HTML and text content',
          isPassing: true,
          severity: 'medium'
        },
        {
          id: 'caps_subject',
          name: 'All caps in subject',
          description: subject.toUpperCase() === subject && subject.length > 5 
            ? 'Your subject line contains excessive capitalization'
            : 'Your subject line uses proper capitalization',
          isPassing: subject.toUpperCase() !== subject || subject.length <= 5,
          severity: 'medium'
        },
        {
          id: 'spam_words',
          name: 'Spam trigger words',
          description: content.includes('free') || content.includes('guaranteed') || content.includes('best price')
            ? 'Email contains potential spam trigger words: "free", "guaranteed", "best price"'
            : 'No common spam trigger words detected',
          isPassing: !content.includes('free') && !content.includes('guaranteed') && !content.includes('best price'),
          severity: 'high'
        },
        {
          id: 'exclamation',
          name: 'Excessive exclamation marks',
          description: (content.match(/!/g) || []).length > 3
            ? 'Email contains excessive exclamation marks (!)'
            : 'Email uses a reasonable number of exclamation marks',
          isPassing: (content.match(/!/g) || []).length <= 3,
          severity: 'low'
        },
        {
          id: 'image_text',
          name: 'Image to text ratio',
          description: 'Your email has a good balance of images and text',
          isPassing: true,
          severity: 'medium'
        },
        {
          id: 'broken_links',
          name: 'Broken or suspicious links',
          description: 'No broken or suspicious links detected',
          isPassing: true,
          severity: 'high'
        },
        {
          id: 'unsubscribe',
          name: 'Unsubscribe link',
          description: content.includes('unsubscribe')
            ? 'Email contains an unsubscribe option (good practice)'
            : 'No unsubscribe link detected - this may affect deliverability',
          isPassing: content.includes('unsubscribe'),
          severity: 'high'
        }
      ];
      
      // Calculate score (lower is better)
      const failingHighSeverity = generatedRules.filter(r => !r.isPassing && r.severity === 'high').length;
      const failingMediumSeverity = generatedRules.filter(r => !r.isPassing && r.severity === 'medium').length;
      const failingLowSeverity = generatedRules.filter(r => !r.isPassing && r.severity === 'low').length;
      
      // Calculate score out of 10 (lower is better)
      const calculatedScore = Math.min(10, failingHighSeverity * 3 + failingMediumSeverity * 1.5 + failingLowSeverity * 0.5);
      
      setSpamScore(calculatedScore);
      setRules(generatedRules);
      setIsChecking(false);
    }, 1500);
  };
  
  // Get color based on spam score
  const getScoreColor = () => {
    if (spamScore === null) return 'text-gray-400';
    if (spamScore <= 2) return 'text-green-500';
    if (spamScore <= 5) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getScoreText = () => {
    if (spamScore === null) return 'Not checked';
    if (spamScore <= 2) return 'Excellent';
    if (spamScore <= 5) return 'Moderate risk';
    return 'High risk';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spam Score Checker</CardTitle>
        <CardDescription>Analyze your email content for spam triggers and deliverability issues</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button 
              onClick={checkSpamScore} 
              disabled={isChecking || !templateContent}
              className="flex items-center"
            >
              {isChecking 
                ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> 
                : <RefreshCw className="h-4 w-4 mr-2" />
              }
              {spamScore === null ? 'Check Spam Score' : 'Re-check Score'}
            </Button>
          </div>
          
          <div className="text-right">
            <div className="text-sm font-medium mb-1">Spam Score</div>
            <div className={`text-3xl font-bold ${getScoreColor()}`}>
              {spamScore !== null ? spamScore.toFixed(1) : '-'} 
              <span className="text-base ml-1">/10</span>
            </div>
            <div className="text-sm text-gray-500">{getScoreText()}</div>
          </div>
        </div>
        
        {rules.length > 0 && (
          <ScrollArea className="h-[280px]">
            <div className="space-y-3">
              {rules.map(rule => (
                <div key={rule.id}>
                  <div className="flex items-start">
                    {rule.isPassing ? (
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : rule.severity === 'high' ? (
                      <AlertCircle className="h-5 w-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-medium text-sm">
                        {rule.name}
                        {!rule.isPassing && rule.severity === 'high' && (
                          <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                            High Impact
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600">{rule.description}</p>
                    </div>
                  </div>
                  <Separator className="mt-3" />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        {spamScore === null && !isChecking && (
          <div className="py-8 text-center text-gray-500">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p>Click "Check Spam Score" to analyze your email content</p>
          </div>
        )}
        
        {isChecking && (
          <div className="py-8 text-center text-gray-500">
            <RefreshCw className="mx-auto h-12 w-12 text-gray-400 mb-2 animate-spin" />
            <p>Analyzing email content...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpamScoreChecker;
