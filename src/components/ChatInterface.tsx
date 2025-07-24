import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, Send, Image, Settings, Languages, Volume2 } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { ProductCard } from './ProductCard';
import { SettingsModal } from './SettingsModal';
import { AccessibilityModal } from './AccessibilityModal';
import { LanguageSelector } from './LanguageSelector';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isImage?: boolean;
}

interface Product {
  id: string;
  name: string;
  price: string;
  vendor: string;
  imageUrl: string;
  productUrl: string;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hi! I can help you find products using text, voice, or images. What are you looking for today?',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, products]);

  const handleSendMessage = async (content: string, isImage = false) => {
    if (!content.trim() && !isImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
      isImage,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `I found some products related to "${content}". Here are the results:`,
        timestamp: new Date(),
      };

      // Mock product results
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Wireless Bluetooth Headphones',
          price: '$59.99',
          vendor: 'TechStore',
          imageUrl: '/placeholder.svg',
          productUrl: '#',
        },
        {
          id: '2',
          name: 'Premium Sound Headset',
          price: '$79.99',
          vendor: 'AudioWorld',
          imageUrl: '/placeholder.svg',
          productUrl: '#',
        },
        {
          id: '3',
          name: 'Pro Gaming Headphones',
          price: '$99.99',
          vendor: 'GameGear',
          imageUrl: '/placeholder.svg',
          productUrl: '#',
        },
      ];

      setMessages(prev => [...prev, botMessage]);
      setProducts(mockProducts);
      setIsLoading(false);
    }, 1500);
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice input not supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      toast({
        title: "Listening...",
        description: "Speak now to search for products",
      });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      handleSendMessage(transcript);
    };

    recognition.onerror = () => {
      toast({
        title: "Voice input error",
        description: "Please try again or use text input.",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        handleSendMessage(imageUrl, true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">P</span>
          </div>
          <h1 className="font-semibold text-foreground">Product Finder</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowLanguages(true)}
            aria-label="Change language"
          >
            <Languages className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowAccessibility(true)}
            aria-label="Accessibility options"
          >
            <Volume2 className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(true)}
            aria-label="Open settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl px-4 py-2 max-w-xs">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          {products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center space-x-2 max-w-4xl mx-auto">
          <div className="flex-1 flex items-center space-x-2 bg-background rounded-full px-4 py-2 border border-input">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your product search or use voice/image..."
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
              aria-label="Product search input"
            />
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="h-8 w-8"
                aria-label="Upload product image"
              >
                <Image className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleVoiceInput}
                className={`h-8 w-8 ${isRecording ? 'bg-destructive text-destructive-foreground' : ''}`}
                aria-label={isRecording ? "Recording voice input" : "Start voice input"}
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim()}
            size="icon"
            className="rounded-full"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        aria-label="File input for product images"
      />

      {/* Modals */}
      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
      <AccessibilityModal open={showAccessibility} onOpenChange={setShowAccessibility} />
      <LanguageSelector open={showLanguages} onOpenChange={setShowLanguages} />
    </div>
  );
};