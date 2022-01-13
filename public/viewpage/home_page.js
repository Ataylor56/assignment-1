import * as Elements from './elements.js';
import { routePath } from '../controller/route.js';
import { currentUser } from '../controller/firebase_auth.js';
import * as ProtectedMessage from './protected_message.js';
import { Thread } from '../model/thread.js';
import * as Constants from '../model/constants.js';
import * as FirestoreController from '../controller/firestore_controller.js';
import * as Util from './util.js';

export function addEventListeners() {
	Elements.menuHome.addEventListener('click', () => {
		history.pushState(null, null, routePath.HOME);
		home_page();
	});

	Elements.formCreateThread.addEventListener('submit', addNewThread);
}

async function addNewThread(e) {
	e.preventDefault();
	const title = e.target.title.value;
	const content = e.target.content.value;
	const keywords = e.target.keywords.value;
	const uid = currentUser.uid;
	const email = currentUser.email;
	const timestamp = Date.now();
	const keywordsArray = keywords.toLowerCase().match(/\S+/g);

	const thread = new Thread({
		title,
		uid,
		content,
		email,
		timestamp,
		keywordsArray,
	});

	try {
		const docId = await FirestoreController.addThread(thread);
		thread.set_docId(docId);
		home_page(); // improved later
		Util.info('Success', 'A new thread has been added', Elements.modalCreateThread);
	} catch (e) {
		Util.info('Failed', JSON.stringify(e), Elements.modalCreateThread);
		if (Constants.DEV) console.log(e);
	}
}

export async function home_page() {
	if (!currentUser) {
		Elements.root.innerHTML = ProtectedMessage.html;
		return;
	}
	// read all threads from DB and render
	let threadList;
	try {
		threadList = await FirestoreController.getThreadList();
	} catch (e) {
		Util.info('Error getting thread list', JSON.stringify(e));
		if (Constants.DEV) console.log(e);
		return;
	}
	buildHomeScreen(threadList);
}

function buildHomeScreen(threadList) {
	let html = '';
	html += `
    <button class="btn btn-outline-success btn-circle" data-bs-toggle="modal" data-bs-target="#modal-create-thread">
    + New Thread
    </button>
    `;

	html += `
        <table class="table table-striped">
    <thead>
        <tr>
        <th scope="col">Action</th>
        <th scope="col">Title</th>
        <th scope="col">Keywords</th>
        <th scope="col">Posted By</th>
        <th scope="col">Content</th>
        <th scope="col">Posted At</th>
        </tr>
    </thead>
    <tbody>
    `;

	threadList.forEach((thread) => {
		html += `
            <tr>
                ${buildThreadView(thread)}
            </tr>
        `;
	});

	html += '</tbody></table>';

	if (threadList.length == 0) {
		html += '<h4 class="d-flex p-3 justify-content-center">No threads found</h4>';
	}

	Elements.root.innerHTML = html;
}

function buildThreadView(thread) {
	return `
        <td>View</td>
        <td>${thread.title}</td>
        <td>${!thread.keywordsArray || !Array.isArray(thread.keywordsArray) ? '' : thread.keywordsArray.join(' ')}</td>
        <td>${thread.email}</td>
        <td>${thread.content}</td>
        <td>${new Date(thread.timestamp).toString()}</td>
    `;
}
