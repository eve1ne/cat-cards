import { NextRequest, NextResponse } from "next/server";

import { tasks } from "@trigger.dev/sdk/v3";

export async function POST(req: NextRequest) {
  const body = await req.json();

  await tasks.trigger("process-pdf", {
    noteId: body.noteId,
    filePath: body.filePath,
  });

  return NextResponse.json({
    success: true,
  });
}
