# AI evaluation

## Status

Evaluation procedure and results have not yet been established.

## Planned measurements

- Rules Q&A correctness and citation support
- Abstention when retrieved evidence is insufficient
- Recommendation relevance, including Hit@5 on persona scenarios
- Comparison of at least two AI tools/models, with and without retrieval where
  applicable

## Reproducibility

Keep datasets in `../eval/`, record model/provider and evaluation settings, and
write results to `../eval/results/`. Recheck provider free-tier limits before
running larger evaluations. Do not include API keys or personal data.
