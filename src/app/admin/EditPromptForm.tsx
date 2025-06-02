"use client";

import { useEffect, useState, useTransition } from "react";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  getLatestSystemPrompt,
  setSystemPrompt,
} from "~/lib/team-builder-actions";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function EditPromptForm() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    getLatestSystemPrompt()
      .then((p) => {
        setPrompt(p ?? "");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch latest system prompt:", err);
        setLoading(false);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id) return;
    startTransition(async () => {
      await setSystemPrompt(user.id, prompt);
      router.refresh();
    });
  }

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Label htmlFor="prompt">AI Assistant Prompt</Label>
      <Textarea
        id="prompt"
        name="prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full"
        rows={6}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Prompt"}
        </Button>
      </div>
    </form>
  );
}
