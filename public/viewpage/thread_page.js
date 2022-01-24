import { currentUser } from '../controller/firebase_auth.js';
import * as Elements from './elements.js';
import * as ProtectedMessage from './protected_message.js';
import * as Util from './util.js';
import * as FirestoreController from '../controller/firestore_controller.js';
import * as Constants from '../model/constants.js';
import { Reply } from '../model/reply.js';
import { routePath } from '../controller/route.js';

export function addViewFormEvents() {
	const viewForms = document.getElementsByClassName('thread-view-form');
	for (let i = 0; i < viewForms.length; i++) {
		attachViewFormEventListener(viewForms[i]);
	}
}

export function attachViewFormEventListener(form) {
	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const button = e.target.getElementsByTagName('button')[0];
		const label = Util.disableButton(button);
		const threadId = e.target.threadId.value;
		history.pushState(null, null, routePath.THREAD + '#' + threadId);
		await thread_page(threadId);
		Util.enableButton(button, label);
	});
}

export async function thread_page(threadId) {
	if (!currentUser) {
		Elements.root.innerHTML = ProtectedMessage.html;
		return;
	}
	if (!threadId) {
		Util.info('Error', 'Thread is null; invalid access');
		return;
	}

	let thread;
	let replies;
	try {
		thread = await FirestoreController.getOneThread(threadId);
		if (!thread) throw `Thread does not exist by id: ${threadId}`;
		replies = await FirestoreController.getReplyList(threadId);
	} catch (e) {
		if (Constants.DEV) console.log(e);
		Util.info('Error', JSON.stringify(e));
	}

	let html = `
		<div class="shadow-lg">
			<div class="bg-primary text-white rounded-top">
				<h6 class="pt-1 px-2">Post:</h6>
				<h4 class="text-white px-2 fw-bolder">${thread.title}</h4>
				<div class="text-white p-2">
					<text class="text-black fw-bolder">(user)</text> <b> ${thread.email} </b> (At ${new Date(thread.timestamp).toString()})
				</div>
			</div>
			<div class="bg-secondary text-white rounded-bottom">
				<h6 class="pt-1 px-2">Post Content</h6>
				<div class="p-3 fw-bolder">${thread.content}</div>
			</div>
		</div>
        <hr>
    `;

	html += `<div id="reply-section">`;
	if (replies && replies.length > 0) {
		replies.forEach((reply) => {
			html += buildReplyView(reply);
		});
	}
	html += `</div>`;

	html += `
        <div>
            <form id="form-add-reply" method="post">
                <textarea name="content" required minlength="3" placeholder="Reply to this thread"></textarea>
                <br>
                <button type="submit" class="btn btn-outline-info">Post reply</button>
            </form>
        </div>
        `;

	Elements.root.innerHTML = html;

	document.getElementById('form-add-reply').addEventListener('submit', async (e) => {
		e.preventDefault();
		const content = e.target.content.value;
		const uid = currentUser.uid;
		const email = currentUser.email;
		const timestamp = Date.now();
		const reply = new Reply({
			uid,
			email,
			timestamp,
			content,
			threadId,
		});

		const button = e.target.getElementsByTagName('button')[0];
		const label = Util.disableButton(button);
		try {
			const id = await FirestoreController.addReply(reply);
			reply.set_docId(id);
		} catch (e) {
			if (Constants.DEV) console.log(e);
			Util.info('Error', JSON.stringify(e));
			return;
		}

		//update browser with reply
		const replyTag = document.createElement('div');
		replyTag.innerHTML = buildReplyView(reply);
		const replySection = document.getElementById('reply-section');
		replySection.appendChild(replyTag);
		e.target.reset();

		Util.enableButton(button, label);
	});
}

function buildReplyView(reply) {
	return `
        <div class="border border-primary rounded">
            <div class="bg-info text-white p-2">
                <b>Reply by ${reply.email}</b> (At ${new Date(reply.timestamp).toString()})
            </div>
			<div class="p-2">
            ${reply.content}
			</div>
        </div>
        <hr>
    `;
}
