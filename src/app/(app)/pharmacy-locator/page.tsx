
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';

const pharmacies = [
  {
    id: 1,
    name: 'Ahuja Medical Hall',
    address: 'Sadar Bazar, Nabha, Punjab 147201',
    phone: '(01765) 221-345',
    hours: '9:00 AM - 9:00 PM',
  },
  {
    id: 2,
    name: 'Singla Medicos',
    address: 'Near Ripudaman College, Nabha, Punjab 147201',
    phone: '(01765) 220-541',
    hours: '10:00 AM - 8:00 PM',
  },
  {
    id: 3,
    name: 'Jindal Medical Store',
    address: 'Main Bazar, Nabha, Punjab 147201',
    phone: '(01765) 502-111',
    hours: '8:00 AM - 10:00 PM',
  },
  {
    id: 4,
    name: 'Gupta Pharmacy',
    address: 'Patiala Gate, Nabha, Punjab 147201',
    phone: '(01765) 223-888',
    hours: '9:30 AM - 9:30 PM',
  },
  {
    id: 5,
    name: 'Community Medicos',
    address: 'Bhavanigarh Road, Nabha, Punjab 147201',
    phone: '(01765) 224-567',
    hours: '24 Hours',
  },
  {
    id: 6,
    name: 'Royal Medical Store',
    address: 'Circular Road, Nabha, Punjab 147201',
    phone: '(01765) 225-999',
    hours: '9:00 AM - 8:30 PM',
  },
];

export default function PharmacyLocatorPage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Pharmacy Locator</CardTitle>
          <CardDescription>
            Find medical stores near your location.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full overflow-hidden rounded-lg border">
            <Image
              src="https://picsum.photos/seed/pharmacy-interior/1200/600"
              alt="Map of nearby pharmacies"
              width={1200}
              height={600}
              className="object-cover"
              data-ai-hint="pharmacy interior"
            />
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Nearby Pharmacies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pharmacies.map((pharmacy) => (
            <Card key={pharmacy.id}>
              <CardHeader>
                <CardTitle>{pharmacy.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                  <span>{pharmacy.address}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{pharmacy.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{pharmacy.hours}</span>
                </div>
              </CardContent>
              <CardHeader>
                <Button variant="outline" className="w-full" asChild>
                  <Link
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      pharmacy.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Directions <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
