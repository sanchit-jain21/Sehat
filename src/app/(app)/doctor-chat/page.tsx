
'use client';
import { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paperclip, Send, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'doctor';
  avatar: string;
  attachment?: {
    name: string;
    url: string;
  };
}

const doctorImage = PlaceHolderImages.find(img => img.id === 'doctor-1');
const userImage = PlaceHolderImages.find(img => img.id === 'user-avatar');


const initialMessages: Message[] = [
  {
    id: 1,
    text: 'Hello! I am Dr. Sharma. How can I help you today?',
    sender: 'doctor',
    avatar: doctorImage?.imageUrl || '',
  },
   {
    id: 2,
    text: 'Hi Dr. Sharma, I wanted to follow up on my prescription.',
    sender: 'user',
    avatar: userImage?.imageUrl || '',
  },
];

export default function DoctorChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to the bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight });
    }
  }, [messages]);


  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() === '') return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      avatar: userImage?.imageUrl || '',
    };

    setMessages([...messages, newMessage]);
    setInput('');
    
    // Simulate doctor's reply
    setTimeout(() => {
        setMessages(prev => [...prev, {
            id: prev.length + 1,
            text: 'Thank you for your message. I am reviewing your request and will get back to you shortly.',
            sender: 'doctor',
            avatar: doctorImage?.imageUrl || ''
        }]);
    }, 1500);

  };
  
  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newAttachmentMessage: Message = {
        id: messages.length + 1,
        text: `Shared an attachment: ${file.name}`,
        sender: 'user',
        avatar: userImage?.imageUrl || '',
        attachment: {
          name: file.name,
          url: URL.createObjectURL(file),
        },
      };
      setMessages([...messages, newAttachmentMessage]);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <Card className="flex h-full flex-col">
        <CardHeader className="flex flex-row items-center border-b">
          <div className="flex items-center space-x-4">
             <Avatar>
                <AvatarImage src={doctorImage?.imageUrl} alt="Dr. Priya Sharma" />
                <AvatarFallback>PS</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>Dr. Priya Sharma</CardTitle>
              <CardDescription>Cardiologist</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
             <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${
                    message.sender === 'user' ? 'justify-end' : ''
                  }`}
                >
                  {message.sender === 'doctor' && (
                    <Avatar className="h-8 w-8">
                       <AvatarImage src={message.avatar} />
                       <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-xs rounded-lg p-3 text-sm lg:max-w-md ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.attachment ? (
                      <a
                        href={message.attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 underline"
                      >
                        <Paperclip className="h-4 w-4" />
                        {message.attachment.name}
                      </a>
                    ) : (
                      <p>{message.text}</p>
                    )}
                  </div>
                   {message.sender === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.avatar} />
                       <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="relative">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pr-24"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
               <input
                type="file"
                ref={fileInputRef}
                onChange={handleAttachment}
                className="hidden"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button type="submit" variant="ghost" size="icon">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
