import { Application } from "./deps.js";
import { Session } from "./deps.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { renderMiddleware } from "./middlewares/renderMiddleware.js";
import { serveStaticMiddleware } from "./middlewares/serveStaticMiddleware.js";
import { router } from "./routes/routes.js";

const app = new Application();
app.use(Session.initMiddleware());

app.use(serveStaticMiddleware);
app.use(renderMiddleware);
app.use(authMiddleware);
app.use(errorMiddleware);

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = Number(Deno.env.get("PORT")) || 7777;
console.log(`Server running on port ${PORT}`);

app.listen({ port: PORT });
