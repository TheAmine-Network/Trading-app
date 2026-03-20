"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { formatCAD } from "@/lib/formatters";

interface CountUpProps {
  valeur: number;
  enCAD?: boolean;
  suffixe?: string;
  className?: string;
  duree?: number;
}

export function CountUp({
  valeur,
  enCAD = false,
  suffixe = "",
  className,
  duree = 1.5,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValeur = useMotionValue(0);
  const spring = useSpring(motionValeur, {
    duration: duree * 1000,
    bounce: 0,
  });
  const estVisible = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (estVisible) {
      motionValeur.set(valeur);
    }
  }, [estVisible, valeur, motionValeur]);

  useEffect(() => {
    return spring.on("change", (derniere) => {
      if (ref.current) {
        if (enCAD) {
          ref.current.textContent = formatCAD(derniere);
        } else {
          ref.current.textContent = `${Math.round(derniere).toLocaleString("fr-CA")}${suffixe}`;
        }
      }
    });
  }, [spring, enCAD, suffixe]);

  return (
    <span ref={ref} className={className}>
      {enCAD ? formatCAD(0) : `0${suffixe}`}
    </span>
  );
}
