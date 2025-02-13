import { hash } from "../../deps.js";
import * as userService from "../../services/userService.js";

const registerUser = async ({ request, response }) => {
    const body = request.body({ type: "form" });
    const params = await body.value;

    const email = params.get("email");
    const password = params.get("password");

    if (!email || !password) {
        response.status = 400;
        response.body = "Email and Password are required.";
        return;
    }
    if (password.length < 4) {
        response.status = 400;
        response.body = "Password must be at least 4 characters long.";
        return;
    }

    const hashedPassword = await hash(password);

    await userService.addUser(email, hashedPassword);

    response.redirect("/auth/login");
};

const showRegistrationForm = ({ render }) => {
    render("registration.eta");
};

export { registerUser, showRegistrationForm };
