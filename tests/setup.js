// tests/setup.js
const real = window.location;
delete window.location;
window.location = { ...real, href: 'http://localhost/' };
