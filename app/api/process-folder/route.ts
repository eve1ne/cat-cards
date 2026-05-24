import { NextRequest, NextResponse } from "next/server";
import { tasks } from "@trigger.dev/sdk/v3";

import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { data: notes, error } = await supabase
    .from("notes")
    .select("*")
    .eq("folder_id", body.folderId);

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }

  for (const note of notes) {
    if (!note.file_url) continue;

    await tasks.trigger("process-pdf", {
      noteId: note.id,
      filePath: note.file_url,
    });
  }

  return NextResponse.json({
    success: true,
  });
}
