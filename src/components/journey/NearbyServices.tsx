
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building, Utensils, Hospital, Fuel } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const serviceCategories = [
    { id: 'restaurants', label: 'Restaurants', icon: Utensils },
    { id: 'hospitals', label: 'Hospitals', icon: Hospital },
    { id: 'hotels', label: 'Hotels', icon: Building },
    { id: 'petrol', label: 'Petrol Pumps', icon: Fuel },
];

const mockData: Record<string, any[]> = {
    restaurants: [
        { name: 'The Gourmet Place', distance: '0.5 km' },
        { name: 'Pizza Paradise', distance: '1.2 km' },
        { name: 'Burger Hub', distance: '2.1 km' },
    ],
    hospitals: [
        { name: 'City General Hospital', distance: '3.5 km' },
        { name: 'Community Health Clinic', distance: '4.0 km' },
    ],
    hotels: [
        { name: 'The Grand Hotel', distance: '2.8 km' },
        { name: 'StayEasy Motel', distance: '5.2 km' },
    ],
    petrol: [
        { name: 'GoGas Station', distance: '0.8 km' },
        { name: 'FuelUp Point', distance: '2.5 km' },
    ],
};

function ServiceList({ category, onNavigate }: { category: string; onNavigate: (name: string) => void; }) {
    const items = mockData[category] || [];

    if (items.length === 0) {
        return <p className="text-sm text-muted-foreground text-center p-8">No {category} found nearby.</p>;
    }
    
    return (
        <ul className="space-y-3">
            {items.map((item, index) => (
                <li key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.distance}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => onNavigate(item.name)}>
                        Go
                    </Button>
                </li>
            ))}
        </ul>
    );
}


export function NearbyServices() {
    const { toast } = useToast();

    const handleNavigate = (name: string) => {
        toast({
            title: "Navigation Started",
            description: `Plotting a route to ${name}. This will be functional in a future update.`,
        });
    }

  return (
    <Card className="border-0 shadow-none">
        <CardHeader className="p-0 mb-4">
            <CardTitle>Nearby Services</CardTitle>
            <CardDescription>Discover places around you.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
            <Tabs defaultValue="restaurants" className="w-full">
                <TabsList className="grid w-full grid-cols-4 h-auto flex-wrap">
                    {serviceCategories.map(({ id, label, icon: Icon }) => (
                        <TabsTrigger key={id} value={id} className="flex-col h-14">
                            <Icon className="h-5 w-5 mb-1" />
                            <span className="text-xs">{label}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>
                <ScrollArea className="h-96 mt-4">
                    {serviceCategories.map(({ id }) => (
                        <TabsContent key={id} value={id}>
                           <ServiceList category={id} onNavigate={handleNavigate} />
                        </TabsContent>
                    ))}
                </ScrollArea>
            </Tabs>
        </CardContent>
    </Card>
  );
}
