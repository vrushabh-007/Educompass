
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Sparkles } from 'lucide-react';

const API_URL = "https://6b6ef45acb16.ngrok-free.app/chat";

export default function ConsultantPage() {
    const [advice, setAdvice] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function getCollegeAdvice() {
        setIsLoading(true);
        setError(null);
        setAdvice('');

        try {
            // In a real app, this would be dynamically pulled from the user's profile
            const studentProfile = "GPA: 3.5, GRE: 320, Budget: 30k, Major: Data Science";
            
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    // ngrok-skip-browser-warning header might be needed if you get ngrok interstitial pages
                    "ngrok-skip-browser-warning": "true"
                },
                body: JSON.stringify({ message: studentProfile })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            if (data.reply) {
                setAdvice(data.reply);
            } else {
                throw new Error("Invalid response format from the advisor API.");
            }

        } catch (err: any) {
            console.error("Error fetching college advice:", err);
            setError(err.message || "An unexpected error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container mx-auto py-8">
            <div className="text-center mb-10">
                <MessageSquare className="mx-auto h-16 w-16 text-primary mb-3" />
                <h1 className="text-4xl font-bold tracking-tight">Professional AI Consultant</h1>
                <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
                    Get personalized advice from our professional AI college consultant based on a sample student profile.
                </p>
            </div>

            <Card className="max-w-2xl mx-auto shadow-xl">
                <CardHeader>
                    <CardTitle>Get Instant Advice</CardTitle>
                    <CardDescription>
                        Click the button below to send a sample student's profile (GPA: 3.5, GRE: 320, Budget: $30k, Major: Data Science) to the AI consultant.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <Button onClick={getCollegeAdvice} disabled={isLoading} size="lg">
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

            {error && (
                <div className="max-w-2xl mx-auto mt-8">
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
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
