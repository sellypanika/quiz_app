import { Session } from "../deps.js";

const isProduction = Deno.env.get("DENO_ENV") === "production";
const sessionOptions = {
  storage: new Session.MemoryStorage(),
  cookie: {
    maxAge: 60 * 60 * 1000, // 1 hour session expiry
     secure: true, 
    httpOnly: true,
    path: "/",
  },
};

const initMiddleware = Session.init(sessionOptions);

export { initMiddleware };
