drop table if exists public.minesweeper_leaderboard cascade;
drop table if exists public.brick_breaker_leaderboard cascade;
drop table if exists public.neon_flow_leaderboard cascade;
drop table if exists public.player_global_stats cascade;
drop table if exists public.game_results cascade;
drop table if exists public.game_players cascade;

drop function if exists public.refresh_game_stats_after_result_change() cascade;
drop function if exists public.refresh_game_stats_tables() cascade;
