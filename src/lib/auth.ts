import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db";
import { checkout, polar, portal } from "@polar-sh/better-auth";
import { polarClient } from "@/lib/polar";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "ad8b2fdf-15b5-4600-89d2-ee9c25d21a27",
              slug: "synapse",
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL!,
        }),
        portal(),
      ],
    }) as any,
  ],
});