import "server-only";
import { analyzeUnprocessedChatLogs } from "./analyze-chat-logs";
import { aggregateCommunityInsights } from "./aggregate-insights";

export type CommunityInsightsPipelineResult = {
  processed: number;
  failed: number;
  groups: number;
  upserted: number;
};

export async function runCommunityInsightsPipeline(): Promise<CommunityInsightsPipelineResult> {
  const analysis = await analyzeUnprocessedChatLogs();
  const aggregated = await aggregateCommunityInsights();

  return {
    processed: analysis.processed,
    failed: analysis.failed,
    groups: aggregated.groups,
    upserted: aggregated.upserted
  };
}
