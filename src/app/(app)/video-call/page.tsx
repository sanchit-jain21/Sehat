
'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, Video, VideoOff, PhoneOff, AlertTriangle } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function VideoCallComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [doctorName, setDoctorName] = useState('Doctor');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  
  const doctorImage = PlaceHolderImages.find(img => img.id === 'video-call-doctor');


  useEffect(() => {
    const name = searchParams.get('doctor');
    if (name) {
      setDoctorName(name);
    }

    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera and microphone permissions in your browser settings.',
        });
      }
    };

    getCameraPermission();

    return () => {
      // Cleanup: stop media tracks when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, [searchParams, toast]);

  const toggleMic = () => {
     if(videoRef.current?.srcObject){
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getAudioTracks().forEach(track => track.enabled = !isMicOn);
        setIsMicOn(!isMicOn);
     }
  };

  const toggleCamera = () => {
    if(videoRef.current?.srcObject){
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getVideoTracks().forEach(track => track.enabled = !isCameraOn);
        setIsCameraOn(!isCameraOn);
     }
  };
  
  const handleEndCall = () => {
    toast({
        title: "Call Ended",
        description: `Your call with ${doctorName} has ended.`,
    });
    router.push('/dashboard');
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex-grow grid md:grid-cols-2 gap-4">
        {/* Doctor's Video */}
        <Card className="flex flex-col">
          <CardContent className="p-2 flex-grow relative">
            <Image
              src={doctorImage?.imageUrl || "https://picsum.photos/seed/doc4/800/600"}
              alt={`Video of ${doctorName}`}
              fill
              className="object-cover rounded-md"
              data-ai-hint={doctorImage?.imageHint || "doctor video"}
            />
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-3 py-1 rounded-md">
              {doctorName}
            </div>
          </CardContent>
        </Card>

        {/* User's Video */}
        <Card className="flex flex-col">
          <CardContent className="p-2 flex-grow relative">
            <video ref={videoRef} className="w-full h-full object-cover rounded-md bg-secondary" autoPlay muted playsInline />
            {!isCameraOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary rounded-md">
                    <VideoOff className="w-16 h-16 text-muted-foreground" />
                </div>
            )}
             <div className="absolute bottom-2 left-2 bg-black/50 text-white px-3 py-1 rounded-md">
              You
            </div>
          </CardContent>
        </Card>
      </div>

       {hasCameraPermission === false && (
         <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Camera & Microphone Access Required</AlertTitle>
            <AlertDescription>
                Please allow camera and microphone access in your browser settings to use the video call feature. You may need to refresh the page after granting permissions.
            </AlertDescription>
          </Alert>
       )}

      {/* Controls */}
      <div className="flex justify-center items-center gap-4 mt-4 p-4 bg-background rounded-lg border">
        <Button
          variant={isMicOn ? 'outline' : 'secondary'}
          size="icon"
          onClick={toggleMic}
          className="h-14 w-14 rounded-full"
          disabled={!hasCameraPermission}
        >
          {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
        </Button>
        <Button
          variant={isCameraOn ? 'outline' : 'secondary'}
          size="icon"
          onClick={toggleCamera}
          className="h-14 w-14 rounded-full"
          disabled={!hasCameraPermission}
        >
          {isCameraOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
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

export default function VideoCallPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VideoCallComponent />
        </Suspense>
    )
}
