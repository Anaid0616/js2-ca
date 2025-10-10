import { onRegister } from "../../ui/auth/register.mjs";

const form = document.forms.register;

form.addEventListener("submit", onRegister);
