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

console.log("Server running on http://localhost:7777");
app.listen({ port: 7777 });
