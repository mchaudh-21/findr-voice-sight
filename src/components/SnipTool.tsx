import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, Globe, X } from 'lucide-react';

interface SnipToolProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productUrl: string;
  productName: string;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh', name: '中文' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
];

export const SnipTool: React.FC<SnipToolProps> = ({ 
  open, 
  onOpenChange, 
  productUrl, 
  productName 
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleTranslateAndRedirect = () => {
    // Create Google Translate URL
    const translateUrl = `https://translate.google.com/translate?sl=auto&tl=${selectedLanguage}&u=${encodeURIComponent(productUrl)}`;
    window.open(translateUrl, '_blank');
    onOpenChange(false);
  };

  const handleDirectRedirect = () => {
    window.open(productUrl, '_blank');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Visit Product Page
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => onOpenChange(false)}
            aria-label="Close snip tool"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You're about to visit the product page for{' '}
            <span className="font-medium text-foreground">{productName}</span>
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Translate page to:</span>
            </div>
            
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger aria-label="Select language for translation">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleDirectRedirect}
            className="flex-1"
            aria-label="Visit original page without translation"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit Original
          </Button>
          <Button
            onClick={handleTranslateAndRedirect}
            className="flex-1"
            aria-label="Translate and visit page"
          >
            <Globe className="h-4 w-4 mr-2" />
            Translate & Visit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};