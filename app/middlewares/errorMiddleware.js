export const errorMiddleware = async (ctx, next) => {
  try {
    await next();
  } catch (_err) {
    //  console.error("Error occurred:", err);
    ctx.response.status = 500;
    ctx.response.body = _err;
  }
};
