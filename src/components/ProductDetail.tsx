import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Volume2, Star, Truck, Shield, X } from 'lucide-react';
import { SnipTool } from './SnipTool';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  price: string;
  vendor: string;
  imageUrl: string;
  productUrl: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  features?: string[];
  specifications?: { [key: string]: string };
  shipping?: string;
  warranty?: string;
  availability?: string;
}

interface ProductDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ 
  open, 
  onOpenChange, 
  product 
}) => {
  const [showSnipTool, setShowSnipTool] = useState(false);
  const { toast } = useToast();

  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      const text = `${product.name} from ${product.vendor} for ${product.price}. ${product.description || 'No description available.'}`;
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Text-to-speech not supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive",
      });
    }
  };

  const handleVisitProduct = () => {
    setShowSnipTool(true);
  };

  // Mock additional product data
  const mockProduct: Product = {
    ...product,
    description: "High-quality wireless headphones with premium sound quality and long battery life. Perfect for music lovers and professionals.",
    rating: 4.5,
    reviewCount: 1234,
    features: [
      "Wireless Bluetooth 5.0 connectivity",
      "30-hour battery life",
      "Active noise cancellation",
      "Comfortable over-ear design",
      "Fast charging support"
    ],
    specifications: {
      "Driver Size": "40mm",
      "Frequency Response": "20Hz - 20kHz",
      "Impedance": "32 Ohms",
      "Weight": "250g",
      "Battery Life": "30 hours",
      "Charging Time": "2 hours"
    },
    shipping: "Free shipping on orders over $50",
    warranty: "2-year manufacturer warranty",
    availability: "In stock"
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Product Details</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => onOpenChange(false)}
              aria-label="Close product details"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Product Image and Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                  src={mockProduct.imageUrl}
                  alt={mockProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{mockProduct.name}</h1>
                  <p className="text-lg text-muted-foreground">by {mockProduct.vendor}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-primary">{mockProduct.price}</span>
                  <Badge variant="secondary" className="text-green-600">
                    {mockProduct.availability}
                  </Badge>
                </div>
                
                {mockProduct.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(mockProduct.rating!) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {mockProduct.rating} ({mockProduct.reviewCount} reviews)
                    </span>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleVisitProduct}
                    className="flex-1"
                    aria-label={`Visit ${mockProduct.name} on ${mockProduct.vendor}`}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Product Page
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleTextToSpeech}
                    aria-label="Read product details aloud"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{mockProduct.description}</p>
            </div>

            {/* Features */}
            {mockProduct.features && (
              <div>
                <h3 className="font-semibold mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {mockProduct.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {mockProduct.specifications && (
              <div>
                <h3 className="font-semibold mb-3">Specifications</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(mockProduct.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-sm font-medium">{key}:</span>
                          <span className="text-sm text-muted-foreground">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Shipping and Warranty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockProduct.shipping && (
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{mockProduct.shipping}</span>
                </div>
              )}
              {mockProduct.warranty && (
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{mockProduct.warranty}</span>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SnipTool
        open={showSnipTool}
        onOpenChange={setShowSnipTool}
        productUrl={mockProduct.productUrl}
        productName={mockProduct.name}
      />
    </>
  );
};