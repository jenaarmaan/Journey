'use server';

/**
 * @fileOverview Personalized routing flow that suggests routes based on user preferences, weather, and special events.
 *
 * - personalizedRouting - A function that suggests personalized routes.
 * - PersonalizedRoutingInput - The input type for the personalizedRouting function.
 * - PersonalizedRoutingOutput - The return type for the personalizedRouting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRoutingInputSchema = z.object({
  origin: z.string().describe('The starting location for the route.'),
  destination: z.string().describe('The destination location for the route.'),
  weatherCondition: z.string().describe('The current weather conditions.'),
  specialEvents: z.string().describe('Any special events happening in the area.'),
  userPreferences: z.string().describe('The user route preferences based on past behavior.'),
});
export type PersonalizedRoutingInput = z.infer<typeof PersonalizedRoutingInputSchema>;

const PersonalizedRoutingOutputSchema = z.object({
  suggestedRoute: z.string().describe('The suggested route based on user preferences, weather, and special events.'),
  estimatedTravelTime: z.string().describe('The estimated travel time for the suggested route.'),
  routeDescription: z.string().describe('A description of the suggested route and why it was chosen.'),
});
export type PersonalizedRoutingOutput = z.infer<typeof PersonalizedRoutingOutputSchema>;

export async function personalizedRouting(input: PersonalizedRoutingInput): Promise<PersonalizedRoutingOutput> {
  return personalizedRoutingFlow(input);
}

const personalizedRoutingPrompt = ai.definePrompt({
  name: 'personalizedRoutingPrompt',
  input: {schema: PersonalizedRoutingInputSchema},
  output: {schema: PersonalizedRoutingOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized route suggestions.

  Based on the user's origin, destination, weather conditions, any special events happening in the area,
  and the user's route preferences learned from past behavior, suggest the best route.

  Origin: {{{origin}}}
  Destination: {{{destination}}}
  Weather Conditions: {{{weatherCondition}}}
  Special Events: {{{specialEvents}}}
  User Preferences: {{{userPreferences}}}

  Consider all factors to provide the most relevant and convenient route option for the user.
  Ensure the route is safe and efficient, taking into account potential delays or hazards.
  If the user prefers a specific type of route, such as highways or avoiding tolls, consider those preferences.

  Provide a detailed description of the suggested route, including why it was chosen over other options,
  and the estimated travel time.
  Be concise and clear in your response.
  `,
});

const personalizedRoutingFlow = ai.defineFlow(
  {
    name: 'personalizedRoutingFlow',
    inputSchema: PersonalizedRoutingInputSchema,
    outputSchema: PersonalizedRoutingOutputSchema,
  },
  async input => {
    const {output} = await personalizedRoutingPrompt(input);
    return output!;
  }
);
