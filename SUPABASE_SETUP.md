# Supabase Setup for Next.js

## Installation Complete ✅

The following Supabase packages have been installed:

- `@supabase/supabase-js` - Core Supabase client library
- `@supabase/ssr` - Server-side rendering support for Next.js

## Configuration Files Created

1. **Server-side client** (`src/lib/supabase/server.ts`) - For server components and API routes
2. **Client-side client** (`src/lib/supabase/client.ts`) - For browser components
3. **Middleware** (`src/middleware.ts`) - For authentication and session management

## Environment Variables

Create a `.env.local` file in your project root with:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Optional: Service role key for admin operations (server-side only)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Getting Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Navigate to Settings > API in your project dashboard
3. Copy the Project URL and anon/public key
4. Add them to your `.env.local` file

## Usage Examples

### Server Component

```tsx
import { createClient } from "@/lib/supabase/server";

export default async function ServerComponent() {
  const supabase = await createClient();
  const { data } = await supabase.from("your_table").select();
  // ... rest of component
}
```

### Client Component

```tsx
"use client";
import { createClient } from "@/lib/supabase/client";

export default function ClientComponent() {
  const supabase = createClient();
  // ... use supabase client
}
```

## Next Steps

1. Set up your environment variables
2. Create your Supabase database tables
3. Start building with Supabase! 🚀
