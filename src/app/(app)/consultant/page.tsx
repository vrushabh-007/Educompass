
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const AI_API_URL = "https://0bdf177e3b1a.ngrok-free.app"; 

export default function ConsultantPage() {
    const [advice, setAdvice] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userInput, setUserInput] = useState('');

    async function sendMessageToAI(userText: string) {
        setIsLoading(true);
        setError(null);
        setAdvice('');
        try {
            const response = await fetch(AI_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // This header is required to bypass the ngrok browser warning page
                    "ngrok-skip-browser-warning": "true"
                },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: "You are a professional College Advisor." },
                        { role: "user", content: userText }
                    ],
                    temperature: 0.7,
                    max_tokens: 150
                })
            });

            if (!response.ok) {
                 const errorText = await response.text();
                throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            if (data.choices && data.choices[0] && data.choices[0].message) {
                setAdvice(data.choices[0].message.content);
            } else {
                throw new Error("Invalid response format from the advisor API.");
            }

        } catch (error: any) {
            console.error("Error connecting to AI:", error);
            const errorMessage = "⚠️ The advisor is currently unavailable. Please check the server connection.";
            setError(errorMessage);
            setAdvice(errorMessage); 
        } finally {
            setIsLoading(false);
        }
    }
    
    function handleGetAdviceClick() {
        if (!userInput.trim()) {
            setError("Please enter your requirements before getting advice.");
            return;
        }
        sendMessageToAI(userInput);
    }


    return (
        <div className="container mx-auto py-8">
            <div className="text-center mb-10">
                <MessageSquare className="mx-auto h-16 w-16 text-primary mb-3" />
                <h1 className="text-4xl font-bold tracking-tight">Professional AI Consultant</h1>
                <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
                    Get personalized advice from our professional AI college consultant by providing your requirements below.
                </p>
            </div>

            <Card className="max-w-2xl mx-auto shadow-xl">
                <CardHeader>
                    <CardTitle>Get Instant Advice</CardTitle>
                    <CardDescription>
                        Enter your academic profile, preferred college type, or any other requirements, then click the button to get AI-powered advice.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="grid w-full gap-1.5">
                      <Label htmlFor="user-requirements">Your Requirements</Label>
                      <Textarea 
                        placeholder="e.g., GPA: 3.8, looking for a public research university in California with a strong computer science program." 
                        id="user-requirements"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <Button onClick={handleGetAdviceClick} disabled={isLoading} size="lg" className="w-full">
                        {isLoading ? "Consulting AI..." : "Get AI College Advice"}
                    </Button>
                </CardContent>
            </Card>

            {isLoading && (
                <Card className="max-w-2xl mx-auto mt-8 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Sparkles className="h-6 w-6 text-accent" /> AI Advisor Response
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                </Card>
            )}

            {error && !isLoading && (
                <div className="max-w-2xl mx-auto mt-8">
                    <Alert variant="destructive">
                        <AlertTitle>Connection Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            )}

            {advice && !isLoading && (
                <Card className="max-w-2xl mx-auto mt-8 shadow-lg bg-muted/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                             <Sparkles className="h-6 w-6 text-accent" /> AI Advisor Response
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground whitespace-pre-wrap">{advice}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
