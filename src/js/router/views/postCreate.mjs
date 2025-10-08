import { onCreatePost } from '../../ui/post/create.mjs';
import { authGuard } from '../../utilities/authGuard.mjs';
import { loadHTMLHeader } from '../../ui/global/sharedHeader.mjs';
import { setLogoutListener } from '../../ui/global/logout.mjs';

loadHTMLHeader();
authGuard();
setLogoutListener();

const form = document.forms.createPost;

form.addEventListener('submit', onCreatePost);
