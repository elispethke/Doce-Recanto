"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { RatingStars } from "@/features/catalog/components/rating-stars";

export function Testimonials() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={testimonial.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: index * 0.1 }}
          className="relative flex flex-col gap-3 rounded-2xl bg-card p-5 ring-1 ring-foreground/[0.06]"
        >
          <Quote className="size-6 text-primary/30" />
          <p className="text-sm leading-relaxed text-foreground/90">“{testimonial.quote}”</p>
          <RatingStars rating={testimonial.rating} />
          <div className="mt-1 flex items-center gap-3">
            <div className="relative size-10 overflow-hidden rounded-full">
              <Image src={testimonial.avatar} alt={testimonial.name} fill sizes="40px" className="object-cover" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
              <p className="text-xs text-muted-foreground">{testimonial.role}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
