# Domain Language

These terms are normative for code, tests and product copy.

| Term | Meaning |
| --- | --- |
| Outcome | The real-world result the user wants, not a portal or form. |
| Outcome definition | A versioned, reviewed template that can generate one family of roadmaps. |
| Knowledge pack | The claims, questions, rules, tasks and journeys supporting a bounded outcome. |
| Roadmap | One user's generated dependency graph for one outcome and one set of facts. |
| Task | A consequential unit of work created by an outcome. |
| Journey | The exact portal or offline procedure that completes a task. |
| Claim | One independently verifiable factual assertion used by a task or journey. |
| Evidence source | A versioned official source supporting a claim. |
| Applicability rule | A deterministic rule that includes, excludes or blocks a task using known facts. |
| Qualifying question | A question whose answer can change the roadmap graph. |
| Candidate task | An AI-discovered possibility that cannot become actionable until reviewed and admitted. |
| Actionable task | A task whose required claims are verified, current and applicable. |
| Authority | The institution responsible for a task, labelled as central, state, local, regulator, court, private regulated or private operational. |
| Dependency | A task or fact that must be satisfied before another task becomes ready. |
| Completion proof | The acknowledgement, certificate, order, reference number or other result a user must confirm. |
| Fail closed | Withhold instructions or conclusions when required facts or evidence are missing, stale or conflicting. |

## Core invariants

1. Outcomes contain tasks; tasks may reference reusable journeys.
2. Tasks form a directed acyclic dependency graph within a generated roadmap.
3. Claims support task fields; task fields do not embed unsourced factual assertions.
4. AI suggestions enter as candidates, never as verified content.
5. State and local dependencies may be visible without being actionable.
6. Completion is a user-confirmed state transition tied to a declared proof.
