"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { counselorFlow } from "@/ai/flows/counselor-flow";
import type { ChatMessage } from "@/lib/types";

export default function CounselorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      content: "Hello! I'm your AI College Counselor. How can I help you with your college application journey today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await counselorFlow(newMessages);
      const modelMessage: ChatMessage = { role: "model", content: response };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error("Error calling counselor flow:", error);
      const errorMessage: ChatMessage = {
        role: "model",
        content: "I'm sorry, but I'm having trouble connecting right now. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <MessageSquare className="mr-3 h-8 w-8 text-primary" /> AI Conversational Counselor
        </h1>
        <p className="text-muted-foreground">
          Your personal guide for all college-related questions.
        </p>
      </div>

      <Card className="flex-1 flex flex-col shadow-xl">
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[calc(100vh-280px)]" ref={scrollAreaRef}>
            <div className="p-6 space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "model" && (
                    <Avatar className="h-9 w-9 border-2 border-primary/50">
                       <AvatarFallback><Sparkles className="h-5 w-5"/></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-md rounded-xl px-4 py-3 text-sm shadow",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted text-foreground rounded-bl-none"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                   {message.role === "user" && (
                    <Avatar className="h-9 w-9 border-2 border-muted">
                       <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               {isLoading && (
                  <div className="flex items-start gap-3 justify-start">
                    <Avatar className="h-9 w-9 border-2 border-primary/50">
                      <AvatarFallback><Sparkles className="h-5 w-5"/></AvatarFallback>
                    </Avatar>
                    <div className="max-w-md rounded-xl px-4 py-3 text-sm shadow bg-muted text-foreground rounded-bl-none">
                      <div className="flex items-center space-x-1">
                        <span className="h-2 w-2 bg-primary rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-primary rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-primary rounded-full animate-pulse"></span>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="w-full flex items-center gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about application deadlines, essay tips, or anything else..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
              <Send className="h-5 w-5" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
