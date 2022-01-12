import { getAuth, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js'
import * as Elements from '../viewpage/elements.js'
import * as Util from '../viewpage/util.js'

const auth = getAuth();



export function addEventListeners() {
    Elements.formSignIn.addEventListener('submit', async e => {
        e.preventDefault(); // keeps from refreshing the current page
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log(`sign in success: ${user}`)
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            Util.info('Sign in error', JSON.stringify(error), Elements.modalSignin)
            console.log(`error: ${errorCode} | ${errorMessage}`)
        }
    });

    Elements.menuSignOut.addEventListener('click', async () => {
        // sign out from Firebase Auth
        try {
            await signOut(auth);
            console.log('sign out success');
        } catch (error) {
            console.log(`sign out error: ${error}`);
        }
    });
}

