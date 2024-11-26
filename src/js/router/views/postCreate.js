import { onCreatePost } from "../../ui/post/create";
import { authGuard } from "../../utilities/authGuard";
import { loadHTMLHeader } from "../../ui/global/sharedHeader.js";

loadHTMLHeader();

authGuard();

const form = document.forms.createPost;

form.addEventListener("submit", onCreatePost);
