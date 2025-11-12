import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BannerCarouselProps {
  banners: { id: string; imageUrl: string }[];
}

export default function BannerCarousel({ banners }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  if (!banners.length) return null;

  return (
    <div className="relative w-full h-48 overflow-hidden rounded-lg" data-testid="banner-carousel">
      <div
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <img
            key={banner.id}
            src={banner.imageUrl}
            alt="Promotional banner"
            className="w-full h-full object-cover flex-shrink-0"
            data-testid={`banner-image-${banner.id}`}
          />
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <Button
            size="icon"
            variant="secondary"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-background/80 backdrop-blur-sm"
            onClick={goToPrevious}
            data-testid="button-banner-prev"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="secondary"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-background/80 backdrop-blur-sm"
            onClick={goToNext}
            data-testid="button-banner-next"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex ? "w-6 bg-primary" : "w-1.5 bg-background/60"
                }`}
                onClick={() => setCurrentIndex(index)}
                data-testid={`button-banner-dot-${index}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
