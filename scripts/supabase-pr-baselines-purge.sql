-- Purge all PR baseline cache rows (run once after PR algorithm bump).
-- New rows use cache_key prefix: algorithmVersion + songLength + poolCardCount + costumeId
-- See PR_BASELINE_ALGO_VERSION in src/lib/prBaselineStore.ts

delete from public.pr_baselines;
