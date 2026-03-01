
'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  ExternalLink
} from 'lucide-react';

export default function ContactPage() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-10 w-full max-w-2xl px-4"
      >
        <Card className="border-border/40 bg-background/60 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

          <CardHeader className="text-center pt-10 pb-6">
            <motion.div variants={itemVariants} className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-4">
              <MessageSquare className="w-8 h-8 text-primary font-bold" />
            </motion.div>
            <CardTitle className="text-4xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              Get in Touch
            </CardTitle>
            <CardDescription className="text-lg mt-2 max-w-sm mx-auto">
              We're here to help you redefine your journey. Reach out to our dedicated support team anywhere, anytime.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants} className="group p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/50 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-lg">Email Support</h4>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  For complex inquiries, our support leads are ready to assist.
                </p>
                <a
                  href="mailto:support@journey.app"
                  className="inline-flex items-center text-primary font-semibold hover:gap-2 transition-all duration-300"
                >
                  support@journey.app <ExternalLink className="ml-1 w-3 h-3" />
                </a>
              </motion.div>

              <motion.div variants={itemVariants} className="group p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/50 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Phone className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-lg">Direct Line</h4>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Speak directly with a coordinator between 9am - 8pm UTC.
                </p>
                <a
                  href="tel:+15551234567"
                  className="inline-flex items-center text-primary font-semibold hover:gap-2 transition-all duration-300"
                >
                  +1 (555) 123-4567 <ExternalLink className="ml-1 w-3 h-3" />
                </a>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="mt-6 p-4 rounded-xl border border-dashed border-border flex items-center space-x-3 text-muted-foreground">
              <MapPin className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">Headquarters: 123 Innovation Drive, Silicon Valley, CA 94025</p>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-10">
              <Button asChild size="lg" className="w-full rounded-xl hover:scale-[1.02] transition-transform duration-200">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Return to Map Navigator
                </Link>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
