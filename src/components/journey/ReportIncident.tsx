
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, TrafficCone, ShieldCheck, Siren } from 'lucide-react';

const incidentTypes = [
  { id: 'crash', label: 'Crash', icon: <Siren className="h-5 w-5" /> },
  { id: 'traffic_jam', label: 'Traffic Jam', icon: <AlertCircle className="h-5 w-5" /> },
  { id: 'construction', label: 'Construction', icon: <TrafficCone className="h-5 w-5" /> },
];

export function ReportIncident() {
  const { toast } = useToast();
  const [selectedIncident, setSelectedIncident] = useState('traffic_jam');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Incident Reported:', { type: selectedIncident, description });
      toast({
        title: "Report Submitted!",
        description: "Thank you for helping improve Journey for everyone.",
        action: <div className="p-2 rounded-full bg-green-500"><ShieldCheck className="h-5 w-5 text-white" /></div>
      });
      setDescription('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Report an Incident</CardTitle>
        <CardDescription>Help other drivers by reporting what you see on the road.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <RadioGroup value={selectedIncident} onValueChange={setSelectedIncident} className="grid grid-cols-3 gap-2">
            {incidentTypes.map((incident) => (
              <div key={incident.id}>
                <RadioGroupItem value={incident.id} id={incident.id} className="sr-only" />
                <Label htmlFor={incident.id} className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${selectedIncident === incident.id ? 'border-primary' : ''}`}>
                  {incident.icon}
                  <span className="mt-2 text-sm">{incident.label}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="e.g., 'Standstill traffic on the bridge'"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
