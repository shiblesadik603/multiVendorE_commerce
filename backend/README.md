# Backend

Node.js + Express + TypeScript REST API with PostgreSQL + Prisma. Owner: S M Shible Sadik.

Status: Day 1 done (tables + API naming agreed, see `docs/day-01/`). Express/Prisma scaffolding is Day 3.

Planned structure (modular monolith):

```
src/
  modules/{auth,users,sellers,categories,products,cart,orders,admin}/
  middleware/   auth, roles, validate, error handler
  config/       env, prisma client
  app.ts  server.ts
prisma/schema.prisma
```
