import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Volume2, Type, Contrast, Mic, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AccessibilityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({ open, onOpenChange }) => {
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(true);
  const [voiceCommandsEnabled, setVoiceCommandsEnabled] = useState(true);
  const [highContrastEnabled, setHighContrastEnabled] = useState(false);
  const [fontSize, setFontSize] = useState([16]);
  const [speechRate, setSpeechRate] = useState([1]);
  const { toast } = useToast();

  const testTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("This is a test of the text-to-speech feature.");
      utterance.rate = speechRate[0];
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Text-to-speech not supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive",
      });
    }
  };

  const toggleHighContrast = (enabled: boolean) => {
    setHighContrastEnabled(enabled);
    if (enabled) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  const adjustFontSize = (size: number[]) => {
    setFontSize(size);
    document.documentElement.style.fontSize = `${size[0]}px`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby="accessibility-description">
        <DialogHeader>
          <DialogTitle>Accessibility Options</DialogTitle>
        </DialogHeader>
        
        <div id="accessibility-description" className="sr-only">
          Configure accessibility settings to improve your experience
        </div>

        <div className="space-y-6">
          {/* Text-to-Speech */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4" />
                <Label htmlFor="tts-toggle">Text-to-Speech</Label>
              </div>
              <Switch
                id="tts-toggle"
                checked={textToSpeechEnabled}
                onCheckedChange={setTextToSpeechEnabled}
                aria-label="Toggle text-to-speech feature"
              />
            </div>
            
            {textToSpeechEnabled && (
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-muted-foreground">Speech Rate</Label>
                  <Slider
                    value={speechRate}
                    onValueChange={setSpeechRate}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="mt-2"
                    aria-label="Adjust speech rate"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Speed: {speechRate[0]}x
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={testTextToSpeech}
                  aria-label="Test text-to-speech with current settings"
                >
                  Test Speech
                </Button>
              </div>
            )}
          </div>

          {/* Voice Commands */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mic className="h-4 w-4" />
              <Label htmlFor="voice-toggle">Voice Commands</Label>
            </div>
            <Switch
              id="voice-toggle"
              checked={voiceCommandsEnabled}
              onCheckedChange={setVoiceCommandsEnabled}
              aria-label="Toggle voice command feature"
            />
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Type className="h-4 w-4" />
              <Label>Font Size</Label>
            </div>
            <Slider
              value={fontSize}
              onValueChange={adjustFontSize}
              min={12}
              max={24}
              step={1}
              className="mt-2"
              aria-label="Adjust font size"
            />
            <div className="text-xs text-muted-foreground">
              Size: {fontSize[0]}px
            </div>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Contrast className="h-4 w-4" />
              <Label htmlFor="contrast-toggle">High Contrast</Label>
            </div>
            <Switch
              id="contrast-toggle"
              checked={highContrastEnabled}
              onCheckedChange={toggleHighContrast}
              aria-label="Toggle high contrast mode"
            />
          </div>

          {/* Visual Indicators */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="h-4 w-4" />
              <Label className="font-medium">Visual Indicators</Label>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Voice recording shows red microphone</li>
              <li>• Typing indicators show animated dots</li>
              <li>• Loading states show progress</li>
              <li>• All buttons have focus indicators</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};