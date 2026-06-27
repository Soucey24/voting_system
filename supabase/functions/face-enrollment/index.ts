import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface FaceEnrollmentRequest {
  userId: string;
  imageBase64: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: FaceEnrollmentRequest = await req.json();
    const { userId, imageBase64 } = body;

    if (!userId || !imageBase64) {
      return new Response(
        JSON.stringify({ error: "Missing userId or imageBase64" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, is_face_enrolled")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (user.is_face_enrolled) {
      return new Response(
        JSON.stringify({ error: "User already face enrolled" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Decode base64 image
    const imageBuffer = Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0));

    // For Phase 1, we'll simulate face detection
    // In production, you would use DeepFace or a similar library
    // Here we're doing basic validation that the image exists and is reasonable size

    if (imageBuffer.length < 1000) {
      return new Response(
        JSON.stringify({ error: "Image too small. Please capture a clearer image." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (imageBuffer.length > 5000000) {
      return new Response(
        JSON.stringify({ error: "Image too large. Please try again." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate a pseudo-embedding (in production, use DeepFace)
    // This is a placeholder that creates a deterministic hash based on the image
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      imageBuffer
    );
    const hashArray = new Uint8Array(hashBuffer);

    // Create a 128-byte embedding (simulated)
    // In production, DeepFace would generate a real embedding vector
    const embedding = new Uint8Array(128);
    for (let i = 0; i < 128; i++) {
      embedding[i] = hashArray[i % 32];
    }

    // Store the embedding in the database
    const { error: updateError } = await supabase
      .from("users")
      .update({
        face_embedding: embedding,
        is_face_enrolled: true
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating user:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to store facial data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Face enrollment completed successfully"
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Face enrollment error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
