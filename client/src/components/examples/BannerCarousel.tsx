import BannerCarousel from "../BannerCarousel";
import burgerBanner from "@assets/generated_images/Burger_special_offer_banner_29506f1a.png";
import pastaBanner from "@assets/generated_images/Pasta_promotion_banner_56244eca.png";
import sushiBanner from "@assets/generated_images/Sushi_special_banner_2f1d67eb.png";

export default function BannerCarouselExample() {
  const banners = [
    { id: "1", imageUrl: burgerBanner },
    { id: "2", imageUrl: pastaBanner },
    { id: "3", imageUrl: sushiBanner },
  ];

  return <BannerCarousel banners={banners} />;
}
