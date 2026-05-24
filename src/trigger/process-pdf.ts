import { task } from "@trigger.dev/sdk/v3";
import PDFParser from "pdf2json";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const processPdf = task({
  id: "process-pdf",

  run: async (payload: {
    noteId: string;
    filePath: string;
  }) => {
    // Download PDF from Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from("notes-files")
      .download(payload.filePath);

    if (error || !data) {
      console.error("Supabase download error:", error);
      throw new Error("Failed to download PDF");
    }

    // Convert to buffer
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text using pdf2json
    const pdfParser = new PDFParser();

    const extractedText: string = await new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (err: any) => {
        reject(err);
      });

      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        try {
          const text = pdfData.Pages
            .map((page: any) =>
              page.Texts.map((t: any) =>
                decodeURIComponent(t.R[0].T)
              ).join(" ")
            )
            .join("\n");

          resolve(text);
        } catch (e) {
          reject(e);
        }
      });

      pdfParser.parseBuffer(buffer);
    });

    console.log("EXTRACTED TEXT:", extractedText);

    // Send to Ollama
    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.2:3b",
        prompt: `
Summarize these study notes clearly and concisely:

${extractedText}`,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate summary from Ollama");
    }

    const ollamaData = await response.json();

    // Save summary back to Supabase
    const { error: updateError } = await supabaseAdmin
      .from("notes")
      .update({
        content: ollamaData.response,
      })
      .eq("id", payload.noteId);

    if (updateError) {
      console.error("Supabase update error:", updateError);
    }

    return {
      success: true,
      summary: ollamaData.response,
    };
  },
});
