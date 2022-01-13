// main root
export const root = document.getElementById('root');

// forms
export const formSignIn = document.getElementById("form-signin");

// menu buttons
export const menuSignOut = document.getElementById('menu-signout');
export const menuHome = document.getElementById('menu-home');
export const menuAbout = document.getElementById('menu-about')

// modals
export const modalSignin = new bootstrap.Modal(document.getElementById('modal-signin-form'), { backdrop: 'static' } );
export const modalInfobox = {
    modal: new bootstrap.Modal(document.getElementById('modal-infobox'), { backdrop: 'static' } ),
    title: document.getElementById('modal-infobox-title'),
    body: document.getElementById('modal-infobox-body'),
}