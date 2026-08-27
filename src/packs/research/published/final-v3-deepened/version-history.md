# Research release history

## `checkpoint-v1`

Published at 2026-08-28 02:01:41 IST as an immutable integration checkpoint in `outputs/checkpoints/2026-08-28T0201-IST-v1`.

- 7 packs, 147 tasks, 206 dependency edges, 347 claims, 218 sources and 64 explicit gaps.
- Independent verdict: `CONDITIONAL_PASS`.
- Integrity is recorded in the checkpoint's `SHA256SUMS.txt`.

## `rolling-v3-deepened`

Published at 2026-08-28 02:58:29 IST as the final research release in `outputs`.

- 7 packs, 162 tasks, 236 dependency edges, 447 claims, 273 sources and 62 explicit gaps.
- Claims: 404 `Verified`, 18 `Candidate`, 4 `Conflict`, 10 `Stale`, and 11 `Unavailable`.
- Independent verdict: `CONDITIONAL_PASS`, with zero open findings after the two post-checkpoint source repairs were reinspected.
- This rolling release does not modify the immutable checkpoint.
