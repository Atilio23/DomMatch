export const dynamic = "force-dynamic";

import createApp from "@genkit-ai/next";
import { ai } from "@/ai/genkit";

// Import flows for side effects
import '@/ai/dev';

const handler = createApp({
  ai,
});

export { handler as GET, handler as POST };
