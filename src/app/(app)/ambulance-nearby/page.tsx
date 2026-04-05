
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Navigation } from 'lucide-react';

const ambulanceServices = [
  {
    id: 1,
    name: 'Nabha Civil Hospital Ambulance',
    phone: '01765-220202',
    eta: '5-7 mins',
    type: 'Basic Life Support (BLS)',
    location: 'Civil Hospital, Nabha',
  },
  {
    id: 2,
    name: 'Red Cross Ambulance Service',
    phone: '102',
    eta: '8-10 mins',
    type: 'Patient Transport Vehicle',
    location: 'Red Cross Building, Nabha',
  },
  {
    id: 3,
    name: 'Jindal Hospital Ambulance',
    phone: '01765-502111',
    eta: '10-12 mins',
    type: 'Advanced Life Support (ALS)',
    location: 'Jindal Hospital, Patiala Gate',
  },
  {
    id: 4,
    name: 'Life Savers Ambulance',
    phone: '98765-43210',
    eta: '7-9 mins',
    type: 'Cardiac Care Unit (CCU)',
    location: 'Near Bus Stand, Nabha',
  },
  {
    id: 5,
    name: 'Nabha Emergency Response',
    phone: '108',
    eta: '4-6 mins',
    type: 'Advanced Life Support (ALS)',
    location: 'Govt. Medical College, Patiala',
  },
  {
    id: 6,
    name: 'Help on Wheels',
    phone: '99887-76655',
    eta: '12-15 mins',
    type: 'Basic Life Support (BLS)',
    location: 'Bhadson Road, Nabha',
  },
];

export default function AmbulanceNearbyPage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Ambulance Nearby</CardTitle>
          <CardDescription>
            Emergency ambulance services near your location.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full overflow-hidden rounded-lg border">
            <Image
              src="https://picsum.photos/seed/map2/1200/600"
              alt="Map of nearby ambulances"
              width={1200}
              height={600}
              className="object-cover"
              data-ai-hint="city map"
            />
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Available Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ambulanceServices.map((service) => (
            <Card key={service.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{service.name}</CardTitle>
                <CardDescription>{service.type}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 flex-grow">
                 <p className="font-bold text-primary text-lg">ETA: {service.eta}</p>
                 <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <Link href={`tel:${service.phone}`} className="hover:underline">{service.phone}</Link>
                </div>
              </CardContent>
              <CardFooter className="grid grid-cols-2 gap-2">
                <Button className="w-full" asChild>
                   <Link href={`tel:${service.phone}`}>
                    <Phone className="mr-2 h-4 w-4" /> Call Now
                   </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link
                    href={`https://www.google.com/maps/search/?api=1&query=ambulance+near+${encodeURIComponent(
                      service.location
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Navigation className="mr-2 h-4 w-4" /> Track
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
