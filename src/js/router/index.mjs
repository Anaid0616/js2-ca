// This function controls which JavaScript file is loaded on which page
// In order to add additional pages, you will need to implement them below
// You may change the behaviour or approach of this file if you choose
export default async function router(pathname = window.location.pathname) {
  switch (pathname) {
    case "/":
      await import("./views/home.mjs");
      break;
    case "/auth/":
      await import("./views/auth.mjs");
      break;
    case "/auth/login/":
      await import("./views/login.mjs");
      break;
    case "/auth/register/":
      await import("./views/register.mjs");
      break;
    case "/post/":
      await import("./views/post.mjs");
      break;
    case "/post/edit/":
      await import("./views/postEdit.mjs");
      break;
    case "/post/create/":
      await import("./views/postCreate.mjs");
      break;
    case "/profile/":
      await import("./views/profile.mjs");
      break;
    default:
      await import("./views/notFound.mjs");
  }
}
