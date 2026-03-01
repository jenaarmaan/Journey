
'use client';

import React, { useState } from 'react';
import { intelligentRerouting, personalizedRouting } from '@/ai/flows';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Route, Sparkles } from 'lucide-react';
import type { AiRouteSuggestion, PersonalizedRouteSuggestion } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export function AiAssist() {
  const [reroutingResult, setReroutingResult] = useState<AiRouteSuggestion | null>(null);
  const [personalizedResult, setPersonalizedResult] = useState<PersonalizedRouteSuggestion | null>(null);
  const [isLoadingRerouting, setIsLoadingRerouting] = useState(false);
  const [isLoadingPersonalized, setIsLoadingPersonalized] = useState(false);

  const handleIntelligentRerouting = async () => {
    setIsLoadingRerouting(true);
    setReroutingResult(null);
    try {
      const result = await intelligentRerouting({
        currentRoute: "US-101 N",
        currentTrafficConditions: "Heavy congestion near downtown",
        predictedCongestion: "High due to evening rush hour",
        origin: "San Francisco, CA",
        destination: "Palo Alto, CA",
      });
      setReroutingResult(result);
    } catch (error) {
      console.error("Error with intelligent rerouting:", error);
    } finally {
      setIsLoadingRerouting(false);
    }
  };

  const handlePersonalizedRouting = async () => {
    setIsLoadingPersonalized(true);
    setPersonalizedResult(null);
    try {
      const result = await personalizedRouting({
        origin: "Brooklyn, NY",
        destination: "JFK Airport, NY",
        weatherCondition: "Light rain",
        specialEvents: "Concert at Barclays Center",
        userPreferences: "Prefers to avoid highways, enjoys scenic routes",
      });
      setPersonalizedResult(result);
    } catch (error) {
      console.error("Error with personalized routing:", error);
    } finally {
      setIsLoadingPersonalized(false);
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary" /> Intelligent Rerouting</CardTitle>
          <CardDescription>Find faster routes based on real-time traffic and congestion predictions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleIntelligentRerouting} disabled={isLoadingRerouting} className="w-full">
            {isLoadingRerouting ? <Loader2 className="animate-spin" /> : 'Suggest Better Route'}
          </Button>
          <AnimatePresence>
            {reroutingResult && (
              <motion.div
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="mt-4 space-y-2 text-sm"
              >
                <p className="font-semibold">Reasoning:</p>
                <p className="text-muted-foreground">{reroutingResult.reasoning}</p>
                <p className="font-semibold mt-2">Suggested Routes:</p>
                <ul className="list-disc pl-5 text-muted-foreground">
                  {reroutingResult.alternativeRoutes.map((route, index) => (
                    <li key={index}>{route}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Route className="text-primary" /> Personalized Routing</CardTitle>
          <CardDescription>Get a route tailored to your preferences and current conditions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handlePersonalizedRouting} disabled={isLoadingPersonalized} className="w-full">
            {isLoadingPersonalized ? <Loader2 className="animate-spin" /> : 'Generate Personalized Route'}
          </Button>
          <AnimatePresence>
            {personalizedResult && (
              <motion.div
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="mt-4 space-y-2 text-sm"
              >
                <p className="font-semibold">Route Description:</p>
                <p className="text-muted-foreground">{personalizedResult.routeDescription}</p>
                <p className="font-semibold mt-2">Suggested Route:</p>
                <p className="text-muted-foreground">{personalizedResult.suggestedRoute}</p>
                <p className="font-semibold mt-2">Estimated Time:</p>
                <p className="text-muted-foreground">{personalizedResult.estimatedTravelTime}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
