import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProductDetail } from './ProductDetail';

interface Product {
  id: string;
  name: string;
  price: string;
  vendor: string;
  imageUrl: string;
  productUrl: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toast } = useToast();
  const [showDetail, setShowDetail] = useState(false);

  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `${product.name} from ${product.vendor} for ${product.price}`
      );
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Text-to-speech not supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium line-clamp-2 text-sm">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="font-bold text-primary">{product.price}</span>
            <span className="text-xs text-muted-foreground">{product.vendor}</span>
          </div>
          
          <div className="flex items-center gap-2 pt-2">
            <Button
              size="sm"
              className="flex-1 text-xs"
              onClick={() => setShowDetail(true)}
              aria-label={`View details for ${product.name}`}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTextToSpeech}
              aria-label={`Read aloud ${product.name} details`}
            >
              <Volume2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
      
      <ProductDetail
        open={showDetail}
        onOpenChange={setShowDetail}
        product={product}
      />
    </Card>
  );
};