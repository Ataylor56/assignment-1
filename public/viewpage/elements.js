export const formSignIn = document.getElementById("form-signin");
export const menuSignOut = document.getElementById('menu-signout');
export const modalInfobox = {
    modal: new bootstrap.Modal(document.getElementById('modal-infobox'), { backdrop: 'static' }),
    title: document.getElementById('modal-infobox-title'),
    body: document.getElementById('modal-infobox-body'),
}