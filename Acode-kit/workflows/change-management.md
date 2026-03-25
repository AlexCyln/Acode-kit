# Acode-kit Change Management

## Large-scale requirement change

Use this lane when the change affects more than 30% of modules.

1. re-run impact analysis
2. use NotebookLM if installed and authenticated
3. otherwise degrade to direct analysis
4. produce a change skeleton for approval
5. update `PRD.md`, `TRACEABILITY_MATRIX.md`, and `DECISION_LOG.md` before implementation resumes

## Version discipline

1. approved pages, APIs, data structures, and module descriptions are frozen until revised
2. if revised, the old version becomes invalid immediately
3. downstream work must re-align to the new approved version
