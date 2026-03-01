import { HomePage } from '@/components/journey/HomePage';

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_ORS_API_KEY || "";
  
  return <HomePage apiKey={apiKey} />;
}
