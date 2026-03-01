'use client';

import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';

export function SosButton() {
  const { toast } = useToast();

  const handleSosClick = () => {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Geolocation Not Supported",
        description: "Your browser does not support this feature.",
      });
      return;
    }

    toast({
        title: "Fetching Location...",
        description: "Please wait while we get your coordinates.",
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const message = `SOS! I need help. My current location is: https://www.google.com/maps?q=${latitude},${longitude}`;
        
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, "_blank");
        
        toast({
          title: "Emergency Message Prepared",
          description: "Your location has been added to a WhatsApp message. Send it to your emergency contact.",
        });
      },
      () => {
        toast({
          variant: "destructive",
          title: "Unable to Retrieve Location",
          description: "Please ensure location services are enabled in your browser and system settings.",
        });
      }
    );
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
      className="absolute bottom-24 right-4 z-20"
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          boxShadow: [
            "0 0 0 0px rgba(239, 68, 68, 0.4)",
            "0 0 0 15px rgba(239, 68, 68, 0)",
            "0 0 0 0px rgba(239, 68, 68, 0)"
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
        className="rounded-full"
      >
        <Button
          variant="destructive"
          size="icon"
          className="h-16 w-16 rounded-full shadow-2xl"
          onClick={handleSosClick}
          aria-label="Emergency SOS"
        >
          <Phone className="h-8 w-8" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
