import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Polar } from "@polar-sh/sdk";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: "sandbox"
});