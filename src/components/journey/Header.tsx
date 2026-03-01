'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  Search,
  ChevronRight,
  Utensils,
  Hotel,
  Ticket,
  Landmark,
  Train,
  HeartPulse,
  CircleDollarSign,
  Loader2,
  User,
  LogOut,
  Mail,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const filterChips = [
  { label: 'Restaurants', icon: <Utensils className="h-4 w-4 mr-2"/>, amenity: 'restaurant' },
  { label: 'Hotels', icon: <Hotel className="h-4 w-4 mr-2"/>, amenity: 'hotel' },
  { label: 'Things to do', icon: <Ticket className="h-4 w-4 mr-2"/>, amenity: 'theatre' },
  { label: 'Museums', icon: <Landmark className="h-4 w-4 mr-2"/>, amenity: 'museum' },
  { label: 'Transit', icon: <Train className="h-4 w-4 mr-2"/>, amenity: 'station' },
  { label: 'Pharmacies', icon: <HeartPulse className="h-4 w-4 mr-2"/>, amenity: 'pharmacy' },
  { label: 'ATMs', icon: <CircleDollarSign className="h-4 w-4 mr-2"/>, amenity: 'atm' },
];

type Suggestion = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

type HeaderProps = {
  onMenuClick: () => void;
  onSearchSubmit: () => void;
  onSearchNearby: (amenity: string) => void;
  originInput: string;
  setOriginInput: (value: string) => void;
  setOriginCoords: (coords: [number, number] | null) => void;
  destinationInput: string;
  setDestinationInput: (value: string) => void;
  setDestinationCoords: (coords: [number, number] | null) => void;
  isAuthenticated: boolean;
  onLoginClick: () => void;
};

export function Header({ 
  onMenuClick, 
  onSearchSubmit, 
  onSearchNearby,
  originInput,
  setOriginInput,
  setOriginCoords,
  destinationInput,
  setDestinationInput,
  setDestinationCoords,
  isAuthenticated,
  onLoginClick
}: HeaderProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [originSuggestions, setOriginSuggestions] = useState<Suggestion[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Suggestion[]>([]);
  const [isFetchingOrigin, setIsFetchingOrigin] = useState(false);
  const [isFetchingDestination, setIsFetchingDestination] = useState(false);
  
  const originInputRef = useRef<HTMLDivElement>(null);
  const destinationInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (originInputRef.current && !originInputRef.current.contains(event.target as Node)) {
        setOriginSuggestions([]);
      }
      if (destinationInputRef.current && !destinationInputRef.current.contains(event.target as Node)) {
        setDestinationSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const fetchSuggestions = async (query: string, setter: React.Dispatch<React.SetStateAction<Suggestion[]>>, fetchingSetter: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!query || query.length < 3) {
      setter([]);
      return;
    }
    fetchingSetter(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const data = await response.json();
      setter(data);
    } catch (error) {
      console.error("Suggestion fetch error:", error);
      setter([]);
    } finally {
        fetchingSetter(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchSuggestions(originInput, setOriginSuggestions, setIsFetchingOrigin);
    }, 400);
    return () => clearTimeout(handler);
  }, [originInput]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchSuggestions(destinationInput, setDestinationSuggestions, setIsFetchingDestination);
    }, 400);
    return () => clearTimeout(handler);
  }, [destinationInput]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
    setOriginSuggestions([]);
    setDestinationSuggestions([]);
  };

  const handleSuggestionClick = (suggestion: Suggestion, type: 'origin' | 'destination') => {
    const coords: [number, number] = [parseFloat(suggestion.lon), parseFloat(suggestion.lat)];
    if (type === 'origin') {
      setOriginInput(suggestion.display_name);
      setOriginCoords(coords);
      setOriginSuggestions([]);
    } else {
      setDestinationInput(suggestion.display_name);
      setDestinationCoords(coords);
      setDestinationSuggestions([]);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged Out", description: "You have been successfully signed out." });
      router.push('/');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Logout Failed', description: error.message });
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-10 p-2 md:p-4">
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-card shadow-lg rounded-lg p-2 flex items-center gap-2"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="flex-shrink-0"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
          <div className="relative flex-1" ref={originInputRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Origin"
              value={originInput}
              onChange={(e) => {
                setOriginInput(e.target.value);
                setOriginCoords(null);
              }}
              className="pl-9 bg-background"
              autoComplete="off"
            />
            {isFetchingOrigin && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />}
            <AnimatePresence>
              {originSuggestions.length > 0 && (
                <motion.ul 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-20 w-full bg-card border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto"
                >
                  {originSuggestions.map(suggestion => (
                    <li key={suggestion.place_id} onClick={() => handleSuggestionClick(suggestion, 'origin')} className="px-3 py-2 text-sm hover:bg-accent cursor-pointer border-b last:border-0">
                      {suggestion.display_name}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
          <div className="relative flex-1" ref={destinationInputRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Destination"
              value={destinationInput}
              onChange={(e) => {
                setDestinationInput(e.target.value)
                setDestinationCoords(null);
              }}
              className="pl-9 bg-background"
              autoComplete="off"
            />
            {isFetchingDestination && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />}
            <AnimatePresence>
              {destinationSuggestions.length > 0 && (
                <motion.ul 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-20 w-full bg-card border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto"
                >
                  {destinationSuggestions.map(suggestion => (
                    <li key={suggestion.place_id} onClick={() => handleSuggestionClick(suggestion, 'destination')} className="px-3 py-2 text-sm hover:bg-accent cursor-pointer border-b last:border-0">
                      {suggestion.display_name}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
           <Button type="submit" size="icon" className="flex-shrink-0">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </form>

        <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full overflow-hidden border">
                            <User className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/profile"><Settings className="mr-2 h-4 w-4" /> Profile Settings</Link>
                        </DropdownMenuItem>
                         <DropdownMenuItem asChild>
                           <Link href="/contact"><Mail className="mr-2 h-4 w-4" /> Contact Us</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                           <LogOut className="mr-2 h-4 w-4" /> Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button variant="outline" onClick={onLoginClick}>Login</Button>
            )}
        </div>
      </motion.div>
       <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 0.2 }}
         className="mt-2 overflow-x-auto pb-2 scrollbar-hide"
       >
         <div className="flex gap-2">
           {filterChips.map((chip) => (
             <Button key={chip.label} variant="outline" size="sm" className="rounded-full whitespace-nowrap bg-card/80 backdrop-blur-sm" onClick={() => onSearchNearby(chip.amenity)}>
               {chip.icon}{chip.label}
             </Button>
           ))}
         </div>
       </motion.div>
    </header>
  );
}
