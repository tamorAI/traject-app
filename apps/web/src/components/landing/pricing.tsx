"use client";

import { motion } from "motion/react";
import { Box, CircleCheck, DollarSign, Gem, type LucideIcon, Users } from "lucide-react";
import { Badge } from "@tamor/ui/components/badge";
import { Button } from "@tamor/ui/components/button";
import { cn } from "@tamor/ui/lib/utils";

interface PricingPlan {
  name: string;
  description: string;
  price: number;
  isRecommended: boolean;
  icon: LucideIcon;
  features: string[];
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    description: "Perfect for individuals who are getting started.",
    price: 10,
    isRecommended: false,
    icon: Box,
    features: [
      "1 Gateway Deployment",
      "500 Enforcement Decisions / day",
      "Basic Plan Graphs",
      "Community Support",
      "1 API Key",
    ],
  },
  {
    name: "Pro",
    description: "Ideal for professionals who need more power.",
    price: 25,
    isRecommended: true,
    icon: Gem,
    features: [
      "5 Gateway Deployments",
      "10,000 Enforcement Decisions / day",
      "Advanced Plan Graphs",
      "Human-in-the-loop Approvals",
      "Priority Support",
      "30-day Audit Log Retention",
    ],
  },
  {
    name: "Team",
    description: "Best for growing teams and small businesses.",
    price: 0, 
    isRecommended: false,
    icon: Users,
    features: [
      "Everything in Pro",
      "Unlimited Gateway Deployments",
      "Unlimited Enforcement Decisions",
      "Incident Investigation & Replay",
      "90-day Audit Log Retention",
      "Dedicated Support",
    ],
  },
];

const Pricing = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="inline-flex items-center gap-2 border border-border bg-background px-4 py-1.5 text-xs text-muted-foreground"
      >
        <DollarSign className="w-3.5 h-3.5" />
        Pricing
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ delay: 0.05, duration: 0.35 }}
        className="mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl font-heading"
      >
        Plans & Pricing
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base"
      >
        Flexible pricing designed to grow with you ready
      </motion.p>

      <div className="mt-12 grid grid-cols-1 gap-1 border bg-muted/40 p-1 sm:mt-16 sm:mt-16 sm:grid-cols-2 md:mt-15 md:grid-cols-3">
        {pricingPlans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} />
        ))}
      </div>
    </section>
  );
};

const PlanCard = ({ plan }: { plan: PricingPlan }) => {
  return (
    <div className={cn(`shadow/5 relative border bg-background`, plan.isRecommended && "border-2 border-black")}>
      {plan.isRecommended || plan.name === "Team" ? (
        <Badge className="absolute top-3 right-3">{plan.isRecommended ? "Most Popular" : "Comming Soon"}</Badge>
      ): ""}
      <div className="border-b border-dashed p-6">
        <plan.icon className="mb-5 text-primary" />
        <div className="flex items-center gap-1">
          <h3 className="font-medium text-2xl tracking-tight">{plan.name}</h3>
        </div>
        <p className="my-2 text-muted-foreground">{plan.description}</p>
      </div>
      <div className="px-6 pt-5 pb-10">
        <p className="mt-4 font-satoshi font-semibold text-4xl">
          ${plan.price}
        </p>
        <p className="mt-1 text-muted-foreground text-sm tracking-normal">
          one-time payment
        </p>
        <Button
          className="my-6 w-full"
          size="lg"
          variant={plan.isRecommended ? "default" : "outline"}
        >
          Get Started
        </Button>
        <ul className="mt-4 space-y-2">
          {plan.features.map((feature) => (
            <li className="flex items-center gap-2" key={feature}>
              <CircleCheck className="size-4 shrink-0 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Pricing;

