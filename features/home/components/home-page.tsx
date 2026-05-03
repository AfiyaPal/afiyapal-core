import { BenefitsSection } from "./benefits-section";
import { FeaturedBlogsSection } from "./featured-blogs-section";
import { HeroSlider } from "./hero-slider";

export function HomePage() {
  return (
    <main>
      <HeroSlider />
      <BenefitsSection />
      <FeaturedBlogsSection />
    </main>
  );
}
