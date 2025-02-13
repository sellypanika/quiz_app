import * as userService from "../../services/userService.js";
import { compare } from "../../deps.js";

const processLogin = async ({ request, response, state }) => {
  const body = request.body({ type: "form" });
  const params = await body.value;

  const userFromDatabase = await userService.findUserByEmail(
    params.get("email")
  );

  if (userFromDatabase.length !== 1) {
    response.redirect("/auth/login?error=invalid_credentials");
    return;
    
  }

  const user = userFromDatabase[0];
  const passwordMatches = await compare(params.get("password"), user.password);

  if (!passwordMatches) {
response.redirect("/auth/login?error=invalid_credentials");
    return;
  }
  //console.log("before session", user);
  await state.session.set("user", user);
  //console.log("after session", user);

  const intendedPath = (await state.session.get("intendedPath")) || "/topics";

  await state.session.set("intendedPath", null);

  response.redirect(intendedPath);
};

const showLoginForm = ({ render, request }) => {
  const errorParam = request.url.searchParams.get("error");
  const errorMessage =
    errorParam === "invalid_credentials"
      ? "Invalid email or password. Please try again."
      : "";

  render("login.eta", { errorMessage });
};

export { processLogin, showLoginForm };
