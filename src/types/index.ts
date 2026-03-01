

import type { LatLng, LatLngExpression } from "leaflet";

export type { LatLng, LatLngExpression };

export type RouteStep = {
  instruction: string;
  distance: number;
  duration: number;
};

export type RouteInfo = {
  duration: string;
  distance: string;
  steps?: RouteStep[];
  safetyScore?: number;
  explanation?: string;
};

export type AiRouteSuggestion = {
  alternativeRoutes: string[];
  reasoning: string;
};

export type PersonalizedRouteSuggestion = {
  suggestedRoute: string;
  estimatedTravelTime: string;
  routeDescription: string;
}

export type NearbyPlace = {
  id: number;
  lat: number;
  lon: number;
  tags: {
    [key: string]: string;
  };
};
