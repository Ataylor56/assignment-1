import * as Elements from './elements.js';

export function addEventListeners() {
    Elements.menuAbout.addEventListener('click', () => {
        about_page();
    });

}

export function about_page() {
    Elements.root.innerHTML = `
        <h1>About Page</h1>
    `;
}