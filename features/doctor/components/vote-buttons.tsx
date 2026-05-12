"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { voteAction, unvoteAction } from "@/features/doctor/actions/vote-actions";
import { cn } from "@/lib/utils";

type Props = {
  blogId: number;
  initialUp: number;
  initialDown: number;
  userVote: "UP" | "DOWN" | null;
  canVote: boolean;
};

export function VoteButtons({ blogId, initialUp, initialDown, userVote, canVote }: Props) {
  const [up, setUp] = useState(initialUp);
  const [down, setDown] = useState(initialDown);
  const [currentVote, setCurrentVote] = useState<"UP" | "DOWN" | null>(userVote);
  const [message, setMessage] = useState<string | null>(null);

  async function handleVote(vote: "UP" | "DOWN") {
    if (!canVote) {
      setMessage("Only verified health professionals can vote.");
      return;
    }

    if (currentVote === vote) {
      const res = await unvoteAction(blogId);
      if (res.ok) {
        if (vote === "UP") setUp((n) => n - 1);
        else setDown((n) => n - 1);
        setCurrentVote(null);
      }
      setMessage(res.ok ? null : res.message);
    } else {
      const res = await voteAction(blogId, vote);
      if (res.ok) {
        if (currentVote === "UP") setUp((n) => n - 1);
        if (currentVote === "DOWN") setDown((n) => n - 1);
        if (vote === "UP") setUp((n) => n + 1);
        if (vote === "DOWN") setDown((n) => n + 1);
        setCurrentVote(vote);
      }
      setMessage(res.ok ? null : res.message);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleVote("UP")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition",
            currentVote === "UP"
              ? "bg-brand-600 text-white shadow-soft"
              : "bg-emerald-50 text-brand-700 hover:bg-brand-100"
          )}
          title="Upvote"
        >
          <ThumbsUp aria-hidden="true" className="size-4" />
          {up}
        </button>
        <button
          onClick={() => handleVote("DOWN")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition",
            currentVote === "DOWN"
              ? "bg-rose-600 text-white shadow-soft"
              : "bg-rose-50 text-rose-700 hover:bg-rose-100"
          )}
          title="Downvote"
        >
          <ThumbsDown aria-hidden="true" className="size-4" />
          {down}
        </button>
      </div>
      {message && <p className="text-xs text-slate-500">{message}</p>}
    </div>
  );
}
