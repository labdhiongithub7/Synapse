import { createAuthClient } from "better-auth/react";

// NOTE: @polar-sh/better-auth@1.1.9 is incompatible with better-auth@1.6.x
// (it imports createAuthEndpoint from "better-auth/plugins" which was removed).
// We create the client without the polar plugin and cast the type to include
// the server-inferred polar endpoints. At runtime, better-auth's client calls
// these endpoints via generic $fetch so they still work without the client plugin.
// The only thing lost is the `checkoutEmbed` client action (embedded checkout).
// To fully fix this, update: npm install @polar-sh/better-auth@latest
export const authClient = createAuthClient() as ReturnType<
  typeof createAuthClient
> & {
  checkout: (params: {
    slug?: string;
    products?: string | string[] | { productId: string; priceId?: string }[];
  }) => Promise<{ url: string; redirect: boolean }>;
  customer: {
    portal: () => Promise<{ url: string; redirect: boolean }>;
    state: () => Promise<any>;
  };
};
