
'use client';
import { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Pill, MapPin, Bot, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { runMedicineFinder, FormState } from './actions';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const mockResults = [
  {
    id: 1,
    pharmacy: 'Nabha Wellness Pharmacy',
    distance: '1.2 km',
    status: 'In Stock',
  },
  {
    id: 2,
    pharmacy: 'City Central Meds',
    distance: '2.5 km',
    status: 'Low Stock',
  },
  {
    id: 3,
    pharmacy: 'HealthFirst Drugstore',
    distance: '3.1 km',
    status: 'In Stock',
  },
  {
    id: 4,
    pharmacy: 'Greenwood Pharmacy',
    distance: '4.8 km',
    status: 'Out of Stock',
  },
  {
    id: 5,
    pharmacy: 'Community Medicos',
    distance: '1.8 km',
    status: 'In Stock',
  },
  {
    id: 6,
    pharmacy: 'Royal Medical Store',
    distance: '3.5 km',
    status: 'In Stock',
  },
  {
    id: 7,
    pharmacy: 'Ahuja Medical Hall',
    distance: '0.8 km',
    status: 'In Stock',
  },
  {
    id: 8,
    pharmacy: 'Singla Medicos',
    distance: '2.1 km',
    status: 'Low Stock',
  },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'In Stock':
      return 'default';
    case 'Low Stock':
      return 'secondary';
    case 'Out of Stock':
      return 'destructive';
  }
};


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
     <Button type="submit" disabled={pending}>
        {pending ? (
            <>
                <Bot className="mr-2 h-4 w-4 animate-spin" />
                Searching...
            </>
        ) : (
            <>
                <Search className="mr-2 h-4 w-4" />
                Search
            </>
        )}
    </Button>
  )
}

export default function MedicineFinderPage() {
    const initialState: FormState = {
        message: '',
        isError: false,
    };
    const [state, formAction] = useActionState(runMedicineFinder, initialState);

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Medicine Availability</CardTitle>
          <CardDescription>
            Search for medicines and check their availability in nearby pharmacies. Our AI will verify the medicine name first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex gap-2">
            <Input
              name="medicineName"
              type="text"
              placeholder="e.g., Paracetamol 500mg"
              className="flex-grow"
              required
            />
            <SubmitButton />
          </form>
            {state?.isError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Validation Error</AlertTitle>
                  <AlertDescription>{state.message}</AlertDescription>
                </Alert>
             )}
        </CardContent>
      </Card>

      {state?.validationResult?.isGenuine && (
        <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Pill className="h-6 w-6 text-primary" />
                <span>Results for "{state.validationResult.correctedName}"</span>
            </h2>
          <div className="space-y-4">
            {mockResults.map((result) => (
              <Card key={result.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>{result.pharmacy}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4" />
                            {result.distance} away
                        </CardDescription>
                    </div>
                    <Badge variant={getStatusVariant(result.status) as any} className="text-sm px-3 py-1">
                      {result.status}
                    </Badge>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}
      {!state?.validationResult?.isGenuine && !state.isError && (
        <div className="text-center text-muted-foreground mt-16">
            <Pill className="mx-auto h-12 w-12"/>
            <p className="mt-4">{state.message || 'Search for a medicine to see availability.'}</p>
        </div>
      )}
    </div>
  );
}
