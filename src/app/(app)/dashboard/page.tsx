
'use client';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  ArrowRight,
  User,
  Clock,
  Video,
  HeartPulse,
  Pill,
  MapPin,
  CalendarPlus,
  Siren,
  Lightbulb,
  Mic,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Area,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';


const appointments = [
  {
    id: 1,
    doctor: 'Dr. Priya Sharma',
    specialty: 'Cardiologist',
    time: '10:30 AM',
    date: 'Today',
    avatar: 'https://picsum.photos/seed/doc1/100/100',
    dataAiHint: 'doctor portrait',
  },
  {
    id: 2,
    doctor: 'Dr. Rohan Mehra',
    specialty: 'Neurologist',
    time: '2:00 PM',
    date: 'Tomorrow',
    avatar: 'https://picsum.photos/seed/doc2/100/100',
    dataAiHint: 'doctor professional',
  },
];

const quickActions = [
  {
    labelKey: 'checkSymptoms',
    icon: HeartPulse,
    href: '/symptom-checker',
  },
  {
    labelKey: 'findMedicine',
    icon: Pill,
    href: '/medicine-finder',
  },
   {
    labelKey: 'chatDoctor',
    icon: MessageSquare,
    href: '/doctor-chat',
  },
  {
    labelKey: 'newAppointment',
    icon: CalendarPlus,
    href: '/appointments',
  },
   {
    labelKey: 'ambulanceNearby',
    icon: Siren,
    href: '/ambulance-nearby',
  },
];

const chartData = [
  { month: 'Jan', score: 75 },
  { month: 'Feb', score: 78 },
  { month: 'Mar', score: 82 },
  { month: 'Apr', score: 80 },
  { month: 'May', score: 85 },
  { month: 'Jun', score: 88 },
];

const healthTips = [
    "Stay hydrated by drinking at least 8 glasses of water a day.",
    "A balanced diet is key to good health. Include a variety of fruits and vegetables.",
    "Get at least 30 minutes of moderate exercise most days of the week.",
    "Aim for 7-9 hours of quality sleep per night for better physical and mental health.",
    "Practice mindfulness or meditation to reduce stress levels."
];

export default function DashboardPage() {
    const [healthTip, setHealthTip] = useState('');
    const { t } = useTranslation();

    useEffect(() => {
        setHealthTip(healthTips[Math.floor(Math.random() * healthTips.length)]);
    }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <Card>
            <CardHeader>
                <CardTitle>{t('upcomingAppointments')}</CardTitle>
                <CardDescription>
                {t('upcomingConsultations', { count: appointments.length })}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {appointments.map((appt) => (
                <div
                    key={appt.id}
                    className="flex items-center space-x-4 rounded-lg border p-4 transition-all hover:bg-secondary"
                    data-date={appt.date}
                >
                    <Image
                    src={appt.avatar}
                    alt={`Dr. ${appt.doctor}`}
                    width={64}
                    height={64}
                    className="rounded-full"
                    data-ai-hint={appt.dataAiHint}
                    />
                    <div className="flex-1">
                    <p className="font-semibold text-lg">{appt.doctor}</p>
                    <p className="text-sm text-muted-foreground flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        {appt.specialty}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {t(appt.date.toLowerCase() as any, appt.date)}, {appt.time}
                    </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" asChild>
                            <Link href={`/voice-call?doctor=${encodeURIComponent(appt.doctor)}`}>
                                <Mic className="mr-2 h-4 w-4" />
                                {t('voiceCall')}
                            </Link>
                        </Button>
                        <Button size="sm" asChild>
                            <Link href={`/video-call?doctor=${encodeURIComponent(appt.doctor)}`}>
                                <Video className="mr-2 h-4 w-4" />
                                {t('joinCall')}
                            </Link>
                        </Button>
                    </div>
                </div>
                ))}
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                    <Link href="/appointments">
                        {t('viewAllAppointments')} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
            </Card>

             <Card>
                <CardHeader className="flex-row items-center gap-4">
                    <Lightbulb className="w-8 h-8 text-yellow-400" />
                    <CardTitle>{t('healthTip')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{healthTip || 'Loading health tip...'}</p>
                </CardContent>
            </Card>

        </div>


      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('quickActions')}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href} className="text-center">
                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border p-4 transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-md h-full">
                  <action.icon className="h-8 w-8 text-primary" />
                  <p className="font-semibold text-sm">{t(action.labelKey)}</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('monthlyWellnessScore')}</CardTitle>
            <CardDescription>
              {t('wellnessTrend')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[60, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorScore)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
