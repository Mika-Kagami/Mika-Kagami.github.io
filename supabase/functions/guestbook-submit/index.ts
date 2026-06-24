import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
const allowedAvatars = new Set(["profile", "profile1", "profile2", "profile3", "profile4", "profile5", "profile6", "profile7"]);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, message, avatar } = await req.json();
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();

    const { data: recentMessages, error: countError } = await supabase
      .from("guestbook")
      .select("id")
      .eq("ip_address", clientIp)
      .gte("created_at", oneHourAgo);

    if (countError) throw countError;

    if ((recentMessages?.length || 0) >= 1) {
      return new Response(
        JSON.stringify({
          error: "rate_limit_exceeded",
          message: "You can send only one message per hour.",
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { error: insertError } = await supabase.from("guestbook").insert({
      name: String(name ?? "").trim(),
      message: String(message ?? "").trim(),
      avatar: typeof avatar === "string" && allowedAvatars.has(avatar) ? avatar : "profile",
      ip_address: clientIp,
    });

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ success: true, message: "Message sent." }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "internal_error",
        message: "Could not send the message.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
