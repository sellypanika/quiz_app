import { Session } from "../deps.js";

const sessionOptions = {
  storage: new Session.MemoryStorage(),
  cookie: {
    maxAge: 60 * 60 * 1000, // 1 hour session expiry
  },
};

const initMiddleware = Session.init(sessionOptions);

export { initMiddleware };
