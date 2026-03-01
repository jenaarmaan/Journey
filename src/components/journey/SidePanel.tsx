
'use client';

import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AiAssist } from "./AiAssist";
import { ReportIncident } from "./ReportIncident";
import { NearbyServices } from "./NearbyServices";
import { Route, Sparkles, MessageSquareWarning, Milestone, Clock, X, MapPin } from 'lucide-react';
import type { RouteInfo } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { motion, AnimatePresence } from 'framer-motion';

type SidePanelProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  routeInfo: RouteInfo | null;
  clearRoute: () => void;
};

export function SidePanel({ isOpen, setIsOpen, routeInfo, clearRoute }: SidePanelProps) {
  const defaultTab = routeInfo ? "route" : "nearby";

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:w-[420px] p-0 flex flex-col">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle className="text-2xl font-bold text-primary">Journey</SheetTitle>
          <SheetDescription>Your intelligent travel companion</SheetDescription>
        </SheetHeader>
        <Tabs defaultValue={defaultTab} className="flex-1 flex flex-col" key={defaultTab}>
          <TabsList className="grid w-full grid-cols-4 mx-auto px-6">
            <TabsTrigger value="route" disabled={!routeInfo}><Route className="mr-1 h-4 w-4" />Route</TabsTrigger>
            <TabsTrigger value="nearby"><MapPin className="mr-1 h-4 w-4" />Nearby</TabsTrigger>
            <TabsTrigger value="ai"><Sparkles className="mr-1 h-4 w-4" />AI Assist</TabsTrigger>
            <TabsTrigger value="report"><MessageSquareWarning className="mr-1 h-4 w-4" />Report</TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="route" className="p-2 md:p-4">
              <AnimatePresence>
                {routeInfo && (
                  <motion.div
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          Route Details
                          <Button variant="ghost" size="icon" onClick={clearRoute} className="h-7 w-7">
                            <X className="h-4 w-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between bg-primary/10 p-3 rounded-lg border border-primary/20">
                            <div className="flex items-center gap-2">
                              <Clock className="h-5 w-5 text-primary" />
                              <span className="font-semibold text-primary">{routeInfo.duration} min</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Milestone className="h-5 w-5 text-primary" />
                              <span className="font-semibold text-primary">{routeInfo.distance} km</span>
                            </div>
                            {routeInfo.safetyScore && (
                              <div className="flex items-center gap-1 bg-green-500/10 text-green-600 px-2 py-1 rounded text-xs font-bold border border-green-500/20">
                                Safety: {routeInfo.safetyScore}%
                              </div>
                            )}
                          </div>

                          {routeInfo.explanation && (
                            <div className="bg-muted p-3 rounded-lg text-sm italic border-l-4 border-primary/50 relative">
                              <Sparkles className="h-4 w-4 absolute -top-2 -left-2 text-primary" />
                              "{routeInfo.explanation}"
                            </div>
                          )}

                          <div className="space-y-3 mt-2">
                            <h3 className="font-semibold text-sm flex items-center gap-2">
                              <Milestone className="h-4 w-4" /> Directions
                            </h3>
                            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                              {routeInfo.steps?.map((step, idx) => (
                                <div key={idx} className="flex gap-3 text-sm border-b pb-2 last:border-0 border-muted">
                                  <span className="text-muted-foreground font-mono w-4 shrink-0">{idx + 1}.</span>
                                  <div className="flex-1">
                                    <p dangerouslySetInnerHTML={{ __html: step.instruction }} />
                                    <span className="text-xs text-muted-foreground">
                                      {step.distance > 1000 ? (step.distance / 1000).toFixed(1) + ' km' : Math.round(step.distance) + ' m'}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button onClick={() => setIsOpen(false)} className="w-full mt-4">
                          Start Navigation
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
              {!routeInfo && (
                <div className="p-4 text-center text-muted-foreground">
                  <p>Search for a destination to see route details here.</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="nearby" className="p-2 md:p-4">
              <NearbyServices />
            </TabsContent>
            <TabsContent value="ai" className="p-2 md:p-4">
              <AiAssist />
            </TabsContent>
            <TabsContent value="report" className="p-2 md:p-4">
              <ReportIncident />
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
