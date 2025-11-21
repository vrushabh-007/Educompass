
import { createClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';

// This route is now primarily for handling the email confirmation link click.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  // If a 'code' is present, it's an OAuth flow (which we are moving away from but might be good to keep for future)
  if (code) {
    const supabase = createClient();
    const { error, data: { session } } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && session) {
      // Check if a profile exists for the user
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      // If no profile, create one
      if (!profile) {
        await supabase.from('profiles').insert({
          id: session.user.id,
          full_name: session.user.user_metadata?.full_name || session.user.email,
          avatar_url: session.user.user_metadata?.avatar_url,
          email: session.user.email,
        });
      }
      revalidatePath('/', 'layout');
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // For email confirmation, Supabase handles session creation automatically on the client side
  // when the user is redirected back to the app. This route's main job is just to redirect.
  // The user clicks the link, gets a session, and is sent to the dashboard.
  return NextResponse.redirect(`${origin}/dashboard`);
}
