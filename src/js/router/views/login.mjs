import { onLogin } from "../../ui/auth/login.mjs";

const form = document.forms.login;

form.addEventListener("submit", onLogin);
