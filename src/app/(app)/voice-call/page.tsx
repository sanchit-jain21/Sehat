
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, PhoneOff, AlertTriangle, User } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


function VoiceCallComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [doctorName, setDoctorName] = useState('Doctor');
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  
  const doctorImage = PlaceHolderImages.find(img => img.id === 'video-call-doctor');
  const userImage = PlaceHolderImages.find(img => img.id === 'user-avatar');


  useEffect(() => {
    const name = searchParams.get('doctor');
    if (name) {
      setDoctorName(name);
    }

    const getMicPermission = async () => {
      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasMicPermission(true);
        // You would typically attach this stream to an audio element or a WebRTC peer connection
      } catch (error) {
        console.error('Error accessing microphone:', error);
        setHasMicPermission(false);
        toast({
          variant: 'destructive',
          title: 'Microphone Access Denied',
          description: 'Please enable microphone permissions in your browser settings.',
        });
      }
       return () => {
            stream?.getTracks().forEach(track => track.stop());
        };
    };

    getMicPermission();
  }, [searchParams, toast]);

  const toggleMic = () => {
    // In a real app, you would mute/unmute the audio track
    setIsMicOn(!isMicOn);
  };
  
  const handleEndCall = () => {
    toast({
        title: "Call Ended",
        description: `Your call with ${doctorName} has ended.`,
    });
    router.push('/dashboard');
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 flex flex-col items-center gap-6">
            <div className="text-center">
                <p className="text-muted-foreground">Voice Call with</p>
                <h1 className="text-3xl font-bold">{doctorName}</h1>
                <p className="mt-4 text-lg text-muted-foreground animate-pulse">Connecting...</p>
            </div>
          
            <div className="flex items-center justify-center gap-12">
                 <Avatar className="h-24 w-24">
                  <AvatarImage src={userImage?.imageUrl} data-ai-hint={userImage?.imageHint} />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                 <Avatar className="h-24 w-24">
                    <AvatarImage src={doctorImage?.imageUrl} data-ai-hint={doctorImage?.imageHint} />
                    <AvatarFallback><User /></AvatarFallback>
                </Avatar>
            </div>
          
        </CardContent>
      </Card>

       {hasMicPermission === false && (
         <Alert variant="destructive" className="mt-4 max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Microphone Access Required</AlertTitle>
            <AlertDescription>
                Please allow microphone access in your browser settings to use the voice call feature.
            </AlertDescription>
          </Alert>
       )}

      {/* Controls */}
      <div className="flex justify-center items-center gap-4 mt-8 p-4 bg-background rounded-lg border">
        <Button
          variant={isMicOn ? 'outline' : 'secondary'}
          size="icon"
          onClick={toggleMic}
          className="h-14 w-14 rounded-full"
          disabled={!hasMicPermission}
        >
          {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
        </Button>
         <Button
          variant="destructive"
          size="icon"
          onClick={handleEndCall}
          className="h-14 w-14 rounded-full"
        >
          <PhoneOff className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}

export default function VoiceCallPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VoiceCallComponent />
        </Suspense>
    )
}
