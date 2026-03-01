
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Search, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function RoutePlanner() {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    toast({
        title: isListening ? "Voice input stopped" : "Listening...",
        description: "Voice assistant feature is coming soon!",
    });
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Plan your Journey</CardTitle>
        <CardDescription>Enter your destination to get started.</CardDescription>
      </CardHeader>
      <CardContent>
          <p className="text-sm text-muted-foreground">
              Please use the search bar at the top of the screen to plan your route.
          </p>
      </CardContent>
    </Card>
  );
}
