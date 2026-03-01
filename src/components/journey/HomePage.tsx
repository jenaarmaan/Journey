
'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { SidePanel } from './SidePanel';
import { SosButton } from './SosButton';
import { MusicPlayer } from './MusicPlayer';
import { Header } from './Header';
import { LoginDialog } from './LoginDialog';
import { useToast } from "@/hooks/use-toast";
import type { RouteInfo, NearbyPlace, LatLngExpression, LatLng } from '@/types';
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from '@/lib/firebase';


const MapComponent = dynamic(() => import('@/components/journey/MapComponent'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted animate-pulse" />,
});

export function HomePage({ apiKey }: { apiKey: string }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [route, setRoute] = useState<LatLngExpression[] | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [originInput, setOriginInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");

  const [originCoords, setOriginCoords] = useState<[number, number] | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null);

  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);

  const [user, setUser] = useState<User | null>(null);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);


  const handleSearchSubmit = async () => {
    if (!user) {
      setIsLoginDialogOpen(true);
      return;
    }

    if (!originCoords || !destinationCoords) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please select a valid origin and destination from the suggestions.',
      });
      return;
    }

    setIsLoading(true);
    setRoute(null);
    setRouteInfo(null);
    setNearbyPlaces([]);

    try {
      const response = await fetch('/api/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin: originCoords, destination: destinationCoords }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not find a route.');
      }

      if (data.features && data.features.length > 0) {
        const currentRoute = data.features[0];
        const routeCoordinates = currentRoute.geometry.coordinates.map(
          (coord: number[]) => [coord[1], coord[0]] as LatLngExpression
        );
        setRoute(routeCoordinates);

        const { summary } = currentRoute.properties;
        setRouteInfo({
          distance: (summary.distance / 1000).toFixed(1),
          duration: (summary.duration / 60).toFixed(0),
          steps: data.instructions,
          safetyScore: data.safetyScore,
          explanation: data.explanation
        });
        if (!isPanelOpen) setIsPanelOpen(true);
      } else {
        throw new Error(data.error?.message || 'Could not find a route.');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Route Search Failed',
        description: error.message || 'Could not find a route between the specified locations. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            const L = (await import('leaflet')).default;
            const location = L.latLng(latitude, longitude);
            setUserLocation(location);
            setOriginCoords([longitude, latitude]);

            try {
              const response = await fetch(`/api/reverse?lat=${latitude}&lon=${longitude}`);

              if (!response.ok) {
                const errorText = await response.text();
                console.error("Reverse geocoding failed with:", errorText);
                throw new Error("Reverse geocoding failed");
              }

              const data = await response.json();
              if (data.display_name) {
                setOriginInput(data.display_name);
              } else {
                setOriginInput(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
              }
            } catch (error) {
              console.error("Error fetching address:", error);
              setOriginInput(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            toast({
              variant: "destructive",
              title: "Geolocation Error",
              description: "Could not get your location. Please enable location services.",
            });
          }
        );
      } else {
        toast({
          variant: "destructive",
          title: "Geolocation Error",
          description: "Geolocation is not supported by your browser.",
        });
      }
    }
    getUserLocation();
  }, [toast]);

  const handleClearRoute = () => {
    setRoute(null);
    setRouteInfo(null);
    setNearbyPlaces([]);
  };

  const handleSearchNearby = async (amenity: string) => {
    if (!userLocation) {
      toast({
        variant: "destructive",
        title: "Location Unknown",
        description: "Could not determine your location to search for nearby places.",
      });
      return;
    }

    setIsLoading(true);
    setNearbyPlaces([]);

    try {
      const response = await fetch(`/api/route?amenity=${amenity}&lat=${userLocation.lat}&lon=${userLocation.lng}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch nearby places.');
      }

      setNearbyPlaces(data);

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Search Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };


  if (!apiKey) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background p-4">
        <div className="text-center p-8 border rounded-lg shadow-lg bg-card max-w-md">
          <h2 className="text-2xl font-bold text-primary mb-2">Welcome to Journey</h2>
          <p className="text-muted-foreground mb-4">
            To get started, please add your OpenRouteService API Key to your local environment file.
          </p>
          <div className="bg-secondary p-3 rounded-md text-sm text-left">
            <p className="font-semibold">1. Create a file named <code className="font-mono">.env.local</code></p>
            <p className="mt-2">2. Add the following line to it:</p>
            <code className="block bg-background p-2 rounded-md mt-2 text-sm text-primary font-mono">
              NEXT_PUBLIC_ORS_API_KEY=YOUR_API_KEY
            </code>
            <p className="mt-2 text-xs text-muted-foreground">
              Get a free key from <a href="https://openrouteservice.org/dev/#/signup" target="_blank" rel="noopener noreferrer" className="underline">openrouteservice.org</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh w-screen overflow-hidden relative bg-background">
      <MapComponent route={route} initialCenter={userLocation} places={nearbyPlaces} />

      <Header
        onMenuClick={() => setIsPanelOpen(true)}
        onSearchSubmit={handleSearchSubmit}
        onSearchNearby={handleSearchNearby}
        originInput={originInput}
        setOriginInput={setOriginInput}
        setOriginCoords={setOriginCoords}
        destinationInput={destinationInput}
        setDestinationInput={setDestinationInput}
        setDestinationCoords={setDestinationCoords}
        isAuthenticated={!!user}
        onLoginClick={() => setIsLoginDialogOpen(true)}
      />

      <SidePanel
        isOpen={isPanelOpen}
        setIsOpen={setIsPanelOpen}
        routeInfo={routeInfo}
        clearRoute={handleClearRoute}
      />

      <LoginDialog
        isOpen={isLoginDialogOpen}
        setIsOpen={setIsLoginDialogOpen}
      />

      <SosButton />
      <MusicPlayer />
    </div>
  );
}
