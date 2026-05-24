import { task } from "@trigger.dev/sdk/v3";
import { supabase } from '@/lib/supabaseClient';

export const generateSummary = task({
  id: "generate-summary",

  run: async (payload: { text: string }) => {
    const response = await fetch(
      "http://localhost:11434/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3.2:3b",
          prompt: `Summarize this text:\n\n${payload.text}`,
          stream: false,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to generate summary");
    }

    const data = await response.json();

    const { error } = await supabase
      .from("summaries")
      .insert({
        original_text: payload.text,
        summary: data.response,
      });

    if (error) {
      console.error(error);
    }

    console.log(data.response);

    return {
      summary: data.response,
    };
  },
});
