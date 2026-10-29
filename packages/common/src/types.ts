export type Role = "BUYER" | "SELLER" | "ADMIN";

declare module "express-serve-static-core" {
  interface Request {
    /** Correlation id: taken from `x-request-id` or generated. Forward it on every downstream call. */
    id: string;
    /** Set by requireAuth. */
    user?: { id: string; role: Role };
    /** Set by requireService: the name of the calling service. */
    service?: string;
  }
}
