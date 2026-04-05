
'use client';

import { useActionState, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { runSymptomChecker, type FormState } from './actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { HeartPulse, Bot, AlertCircle, ShieldAlert, Activity, Stethoscope, BriefcaseMedical, Upload, Mic, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useVoiceRecognition } from '@/hooks/use-voice-recognition';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Bot className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <HeartPulse className="mr-2 h-4 w-4" />
          Get AI Guidance
        </>
      )}
    </Button>
  );
}

const severityMap = {
    mild: { label: 'Mild', color: 'bg-green-500', icon: Activity },
    moderate: { label: 'Moderate', color: 'bg-yellow-500', icon: ShieldAlert },
    severe: { label: 'Severe', color: 'bg-orange-500', icon: ShieldAlert },
    emergency: { label: 'Emergency', color: 'bg-red-500 animate-pulse', icon: ShieldAlert },
};

const likelihoodMap = {
    low: { label: 'Low', variant: 'outline' },
    medium: { label: 'Medium', variant: 'secondary' },
    high: { label: 'High', variant: 'default' },
};


function GuidanceDisplay({ guidance }: { guidance: FormState['guidance'] }) {
  if (!guidance) {
    return (
      <div className="text-center text-muted-foreground pt-10">
        <HeartPulse className="mx-auto h-12 w-12" />
        <p className="mt-4">
          Your guidance will appear here after you submit your symptoms.
        </p>
      </div>
    );
  }
  
  const severityInfo = severityMap[guidance.severity];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <severityInfo.icon className="h-5 w-5" />
            Overall Severity Assessment
        </h3>
         <Badge className={`px-3 py-1 text-sm text-white ${severityInfo.color}`}>{severityInfo.label}</Badge>
      </div>

       <div>
        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Potential Conditions
        </h3>
        <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
          {guidance.potentialConditions.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>
                <div className="flex items-center justify-between w-full pr-4">
                    <span>{item.condition}</span>
                    <Badge variant={likelihoodMap[item.likelihood].variant as any}>
                        {likelihoodMap[item.likelihood].label} Likelihood
                    </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {item.explanation}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      
       <div>
        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <BriefcaseMedical className="h-5 w-5" />
            Recommended Next Steps
        </h3>
        <p className="text-muted-foreground">{guidance.recommendation}</p>
      </div>
      
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Disclaimer</AlertTitle>
        <AlertDescription>
          {guidance.disclaimer}
        </AlertDescription>
      </Alert>
    </div>
  );
}


export default function SymptomCheckerPage() {
  const initialState: FormState = {
    message: '',
    isError: false,
  };
  const [state, formAction] = useActionState(runSymptomChecker, initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please select an image smaller than 4MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        setPhotoDataUri(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setPhotoDataUri('');
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const { isListening, transcript, toggleListening } = useVoiceRecognition({
      onTranscript: (text) => {
        const symptomsTextarea = document.getElementById('symptoms') as HTMLTextAreaElement;
        if (symptomsTextarea) {
            symptomsTextarea.value = text;
        }
      },
  });

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      <Card className="self-start">
        <CardHeader>
          <CardTitle>AI Symptom Checker</CardTitle>
          <CardDescription>
            Describe your symptoms, and optionally upload a photo, to get preliminary AI-powered guidance. This is not a substitute for professional medical advice.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="symptoms">Symptoms</Label>
              <div className="relative">
                <Textarea
                  id="symptoms"
                  name="symptoms"
                  placeholder="e.g., I have a persistent cough, a slight fever, and a headache."
                  rows={5}
                  required
                  defaultValue={transcript}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn("absolute bottom-2 right-2", isListening && "bg-destructive text-destructive-foreground")}
                  onClick={toggleListening}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Upload Injury Photo (Optional)</Label>
              <Input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <input type="hidden" name="photoDataUri" value={photoDataUri} />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Select Image
              </Button>
              {imagePreview && (
                <div className="relative mt-2 rounded-md overflow-hidden border w-fit">
                    <Image
                        src={imagePreview}
                        alt="Injury preview"
                        width={100}
                        height={100}
                        className="object-cover"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={removeImage}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age (Optional)</Label>
                <Input id="age" name="age" type="number" placeholder="e.g., 35" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender (Optional)</Label>
                <Select name="gender">
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
             {state?.isError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{state.message}</AlertDescription>
                </Alert>
             )}
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">AI Guidance</h2>
        <Card className="min-h-[400px]">
          <CardContent className="p-6">
            <GuidanceDisplay guidance={state?.guidance} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
