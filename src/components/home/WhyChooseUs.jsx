
"use client";

import { motion } from "framer-motion";

const benefits = [
  {
    icon: "🏡",
    title: "Verified Properties",
    description:
      "Explore admin-approved properties and find a place that matches your needs.",
  },
  {
    icon: "🔒",
    title: "Secure Booking",
    description:
      "Book your preferred property through a simple and reliable booking process.",
  },
  {
    icon: "💳",
    title: "Easy Payments",
    description:
      "Complete your booking payments conveniently through our online payment system.",
  },
  {
    icon: "🤝",
    title: "Trusted Experience",
    description:
      "Enjoy a smooth rental experience with dedicated features for tenants and property owners.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-[#faf8f4] py-24">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#b8893a]/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#0f2a47]/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#b8893a]/30 bg-[#b8893a]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#a4772e]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#b8893a]" />
            The Rentora Advantage
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#0f2a47] sm:text-5xl">
            Why Choose{" "}
            <span className="text-[#b8893a]">Rentora?</span>
          </h2>

          <p className="mt-5 leading-8 text-slate-500">
            We make finding, booking, and managing rental properties easier
            with a convenient and reliable platform.
          </p>
        </motion.div>

        {/* Benefit Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{
                opacity: 0,
                y: 60,
                rotateX: 12,
                scale: 0.94,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                rotateX: 0,
                scale: 1,
              }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -12,
                rotateX: 4,
                rotateY: -3,
                scale: 1.025,
                transition: {
                  type: "spring",
                  stiffness: 250,
                  damping: 18,
                },
              }}
              style={{ transformPerspective: 1000 }}
              className="group relative"
            >
              <div className="relative h-full overflow-hidden rounded-3xl border border-[#e6e1d6] bg-white p-7 shadow-[0_8px_30px_rgba(15,42,71,0.04)] transition-colors duration-500 hover:border-[#b8893a]/60 hover:shadow-[0_20px_50px_rgba(184,137,58,0.15)]">
                {/* Hover Glow */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#b8893a]/10 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />

                {/* Top Accent */}
                <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-[#b8893a] to-[#e8c477] transition-all duration-700 group-hover:w-full" />

                {/* Icon */}
                <motion.div
                  animate={{
                    y: [0, -7, 0],
                    rotate: [0, 3, 0, -3, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.3,
                  }}
                  className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#b8893a]/20 bg-[#faf8f4] text-3xl shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:border-[#b8893a]/50 group-hover:bg-[#f5ead5] group-hover:shadow-[0_8px_25px_rgba(184,137,58,0.18)]"
                >
                  {benefit.icon}
                </motion.div>

                {/* Content */}
                <h3 className="relative mt-7 text-xl font-bold text-[#0f2a47] transition-colors duration-300 group-hover:text-[#b8893a]">
                  {benefit.title}
                </h3>

                <p className="relative mt-4 text-sm leading-7 text-slate-500">
                  {benefit.description}
                </p>

                {/* Bottom Decoration */}
                <div className="relative mt-7 flex items-center gap-2">
                  <span className="h-1 w-8 rounded-full bg-[#b8893a] transition-all duration-500 group-hover:w-16" />
                  <span className="h-1 w-2 rounded-full bg-[#e6e1d6] transition-all duration-500 group-hover:w-5 group-hover:bg-[#b8893a]/40" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
