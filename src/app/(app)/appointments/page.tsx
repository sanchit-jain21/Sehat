
'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getDoctors, type Doctor } from '@/lib/services/doctors';

const timeSlots = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
];

export default function AppointmentsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchDoctors() {
      const fetchedDoctors = await getDoctors();
      setDoctors(fetchedDoctors);
    }
    fetchDoctors();
  }, []);

  const handleBookNow = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setSelectedTime(null);
  };

  const handleConfirmBooking = () => {
    if (selectedDoctor && selectedDate && selectedTime) {
      toast({
        title: 'Appointment Booked!',
        description: `Your consultation with ${selectedDoctor.name} is confirmed for ${selectedDate.toLocaleDateString()} at ${selectedTime}.`,
      });
      setSelectedDoctor(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
              <Image
                src={doctor.avatar}
                alt={doctor.name}
                width={80}
                height={80}
                className="rounded-full border-2 border-primary"
                data-ai-hint={doctor.dataAiHint}
              />
              <div>
                <CardTitle>{doctor.name}</CardTitle>
                <CardDescription>{doctor.specialty}</CardDescription>
                <p className="text-sm text-muted-foreground mt-1">
                  {doctor.experience} years of experience
                </p>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{doctor.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({doctor.reviews} reviews)
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleBookNow(doctor)}
                disabled={!doctor.available}
              >
                {doctor.available ? 'Book Consultation' : 'Unavailable'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Dialog open={!!selectedDoctor} onOpenChange={() => setSelectedDoctor(null)}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Schedule with {selectedDoctor?.name}</DialogTitle>
            <DialogDescription>
              Select a date and time for your consultation.
            </DialogDescription>
          </DialogHeader>
          {selectedDoctor && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                    className="rounded-md border"
                  />
                </div>
                <div className="flex flex-col gap-2">
                    <h4 className="font-medium text-center md:text-left">Available Slots</h4>
                    <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2">
                        {timeSlots.map(time => (
                            <Button 
                                key={time}
                                variant={selectedTime === time ? 'default' : 'outline'}
                                onClick={() => setSelectedTime(time)}
                            >
                                {time}
                            </Button>
                        ))}
                    </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedDoctor(null)}>Cancel</Button>
                <Button onClick={handleConfirmBooking} disabled={!selectedDate || !selectedTime}>
                    Confirm Booking
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
