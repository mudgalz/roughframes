import { Separator } from "@/components/ui/separator";
import { featuresList } from "../data";
import FeaturesSection from "./FeaturesSection";
import HeroSection from "./HeroSection";

export default function () {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <HeroSection />
      <Separator />
      <FeaturesSection featuresList={featuresList} />
      <Separator />
    </main>
  );
}
