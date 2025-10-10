import { onCreatePost } from "../../ui/post/create.mjs";
import { authGuard } from "../../utilities/authGuard.mjs";
import { loadHTMLHeader } from "../../ui/global/sharedHeader.mjs";

loadHTMLHeader();
authGuard();

const form = document.forms.createPost;

form.addEventListener("submit", onCreatePost);
