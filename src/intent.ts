import type {
  IntentProvider,
  IntentProviderRequest,
  IntentProviderResult,
} from "./domain.js";

function deterministicInterpretation(
  request: IntentProviderRequest,
): IntentProviderResult {
  const normalized = request.text.toLocaleLowerCase("en-IN").trim();
  const scored = request.outcomes
    .map((outcome) => ({
      outcome,
      score: outcome.intentPhrases.reduce(
        (total, phrase) =>
          total +
          (normalized.includes(phrase.toLocaleLowerCase("en-IN")) ? 1 : 0),
        0,
      ),
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) =>
      right.score - left.score || left.outcome.id.localeCompare(right.outcome.id),
    );
  const winner =
    scored[0] && scored[1]?.score !== scored[0].score ? scored[0].outcome : undefined;

  return {
    ...(winner ? { outcomeId: winner.id } : {}),
    selectedTaskIds: winner?.approvedTaskIds ?? [],
    selectedQuestionIds: winner?.approvedQuestionIds ?? [],
    extractedAnswers: {},
  };
}

export const deterministicIntentProvider: IntentProvider = {
  kind: "deterministic",
  interpret: async (request) => deterministicInterpretation(request),
};
