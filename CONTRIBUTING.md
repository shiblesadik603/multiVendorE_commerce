# Team workflow

Two people: **frontend** and **backend (S M Shible Sadik)**.

## Daily rhythm
1. First 10 min: what I finished, what I'll do, what blocks me.
2. Next 80 min: own task.
3. Last 30 min: connect frontend to backend, test, commit, update the board and `docs/DAILY_LOG.md`.

## Git
- `main` is always working. Never push broken code to it.
- Branch names: `frontend/day-04-ui-kit`, `backend/day-05-auth-middleware`.
- Small commits, message style: `feat(auth): add login endpoint`, `docs: ...`, `chore: ...`, `fix: ...`.
- Open a PR into `main`; the other person reviews when practical.
- A task is done only when it works, is tested, and is merged.
- Never commit `.env` files or secrets (use `.env.example`).

## Contract between frontend and backend
- Backend publishes endpoint paths and example JSON early in `docs/api/*.openapi.yaml`.
- Frontend builds against mock data until the endpoint is ready.
- Changing an endpoint = update the doc in the same PR and tell the other person.
