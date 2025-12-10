import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ComponentType } from "react";

type FeatureItem = {
  icon: ComponentType;
  title: string;
  description: string;
};

interface FeaturesSectionProps {
  featuresList: FeatureItem[];
}

const FeaturesSection = ({ featuresList }: FeaturesSectionProps) => {
  return (
    <section className="w-full py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        {/* Heading */}
        <div className="mb-14 space-y-3 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Powerful Features Built for Speed
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Dotmark gives you the tools to manage files, annotate instantly, and
            stay in flow.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuresList.map((feature, i) => (
            <Card
              key={i}
              className={cn(
                "bg-[#111217] border border-white/10 rounded-xl shadow-sm",
                "hover:border-indigo-500/60 hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.4)] transition-all duration-300"
              )}>
              <CardContent className="p-6">
                {/* Icon */}
                <Avatar className="mb-6 size-12 rounded-md bg-indigo-500/10 text-indigo-400">
                  <AvatarFallback className="rounded-md [&>svg]:size-6 text-indigo-400 bg-transparent">
                    <feature.icon />
                  </AvatarFallback>
                </Avatar>

                {/* Title */}
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>

                {/* Description */}
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
