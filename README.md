# FED2 JavaScript 2 CSS Frameworks - Pixly (Social Media App)

**Diana Bergelin**

![Pixly](https://github.com/user-attachments/assets/cda022c1-e37b-4e90-b97c-3a8086995dbc)

### Introduction

Social Media (CRUD + Extras)

A functional, responsive Vanilla JS + Vite + Tailwind social media app built during the JavaScript 2 CSS Frameworks course at Noroff. Users can register, log in, create/read/update/delete their own posts, and interact with others via follow/unfollow, reactions, and comments. The app consumes the Noroff Social API and focuses on clean app logic, API integration, and an easy-to-use UI.

[Live Site Pixly (Social Media App)](https://pixly-js2.netlify.app/)

---

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Future Improvements](#future-improvements)
- [Credits](#credits)
- [Delivery](#Delivery)
- [License](#license)

---


## Description

Goal: build a client-side app against the Noroff Social API with Register/Login and Create/Read/Update/Delete for the user’s own posts. The app stores the JWT in localStorage and uses a clean, responsive UI built with Tailwind.

---

## Features

- **Auth:** Register, login, logout (JWT in localStorage).
- **Post CRUD:** Create, list (feed + per profile), view single post, update, delete (owner only).
- **Reactions:** 👍 ❤️ 🔥 — toggled via API.
- **Comments:** Add and delete own comments.
- **Follow System:** Follow/Unfollow + Followers/Following counters with dropdown linked names.
- **Profiles:** Own profile (update avatar/bio) and other users’ profiles.
- **Pagination:** On profile posts, hidden if there’s only one page.
- **A11y & performance:** Semantic structure, alt texts, preconnect, controlled loading/fetchpriority.

---

## Technologies Used

- **Frontend:**  
   ![HTML5](https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white&style=for-the-badge) ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black&style=for-the-badge) ![Tailwind](https://img.shields.io/badge/-Tailwind-06B6D4?logo=tailwind-css&logoColor=white&style=for-the-badge)

- **Tools:**  
  ![Figma](https://img.shields.io/badge/-Figma-F24E1E?logo=figma&logoColor=white&style=for-the-badge) ![VSCode](https://img.shields.io/badge/-VSCode-007ACC?logo=visual-studio-code&logoColor=white&style=for-the-badge)

---

## Installation

Require Node.js

### 1. Clone the repository:

```bash
git clone https://github.com/Anaid0616/js2-ca.git
```

### 2. Navigate into the project folder:

```bash
cd js2-ca
```

### 3. Install:

```bash
npm install
```

### 4. Run the project locally:

```bash
npm run dev
```

### (optional) Build/Preview:
```bash
npm run build
npm run preview
```

---

## Usage

**Register or log in** to use the app.

**Create posts** (image + title + body).

**Edit or delete** your own posts from the post detail page.

**React** with emojis, comment, and delete your own comments.

**Follow** or unfollow profiles; view followers/following with dropdown lists.

---

## File Structure

src/

  api/           # API calls (auth, posts, profiles)
  
  ui/            # UI modules (CRUD, reactions, comments, header)
  
  router/views/  # Page entry scripts
  
  utilities/     # helpers (doFetch, authGuard, skeletons, dom)
  
public/

  images/        # logos, placeholders, shared header HTML
  
index.html       # main entry

---

## Future improvements

**Global Search** Search for other usernames.

**Following feed** See feed from the ones you follow.

**Dark Mode:** Implement a toggle for better accessibility.

---

## Acknowledgments

**Design and Development:** [Diana Bergelin](https://github.com/Anaid0616)

**Design:** Figma, Icons: Fontawesome

**Icons:** Font Awesome

**Images:** Unsplash photos, Postimages for getting the media URL [Link](https://postimages.org/)

**Information:** Noroffs school, Tailwind Docs, Tailwind CSS cheat sheet, MDN

**API Documentation:** Noroff API

**Debugging & brainstorming:** ChatGPT

---

## Contributing

Since this is a school project, contributions are not needed. However, if you have any feedback or suggestions, feel free to reach out!

## Contact

If you want to connect or learn more about me:

Email: diana.bergelin@live.se

[LinkedIn](https://www.linkedin.com/in/diana-b-4209a72ba/)

## **License**

This project is not currently under any open-source license as it's a school project.

[Back to Top](#FED2-JavaScript-2-CSS-Frameworks-Pixly-(Social-Media-App)
