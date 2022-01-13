import * as FirebaseAuth from './controller/firebase_auth.js';
import * as Home from './viewpage/home_page.js';
import * as About from './viewpage/about_page.js';
import { routing } from './controller/route.js';

FirebaseAuth.addEventListeners();
Home.addEventListeners();
About.addEventListeners();

window.onload = () => {
    const pathname = window.location.pathname;
    const hash = window.location.hash;
    routing(pathname, hash);
}