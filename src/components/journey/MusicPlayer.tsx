
'use client';

import React from 'react';
import Image from "next/image";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
      className="absolute bottom-0 left-0 right-0 z-20 p-2 md:p-4 pointer-events-none"
    >
      <div className="bg-card/90 backdrop-blur-md text-card-foreground rounded-xl shadow-2xl p-3 max-w-sm mx-auto pointer-events-auto">
        <div className="flex items-center gap-4">
          <Image
            src="https://placehold.co/64x64.png"
            data-ai-hint="album art"
            alt="Album Art"
            width={56}
            height={56}
            className="rounded-md"
          />
          <div className="flex-1 overflow-hidden">
            <h3 className="font-semibold truncate">Midnight City</h3>
            <p className="text-sm text-muted-foreground truncate">M83</p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="w-9 h-9">
                <SkipBack className="h-5 w-5" />
            </Button>
            <Button 
                onClick={() => setIsPlaying(!isPlaying)}
                size="icon"
                className="w-11 h-11 bg-primary text-primary-foreground rounded-full hover:bg-primary/90"
            >
                {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
            </Button>
            <Button variant="ghost" size="icon" className="w-9 h-9">
                <SkipForward className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">1:32</span>
            <Slider defaultValue={[40]} max={100} step={1} />
            <span className="text-xs text-muted-foreground">3:58</span>
        </div>
      </div>
    </motion.div>
  );
}
