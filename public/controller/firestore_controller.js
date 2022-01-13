import {
	collection,
	getFirestore,
	addDoc,
	getDocs,
	query,
	orderBy,
	doc,
	getDoc,
	where,
} from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js';
import { COLLECTIONS } from '../model/constants.js';
import { Thread } from '../model/thread.js';
import { Reply } from '../model/reply.js';

const db = getFirestore();

export async function addThread(thread) {
	const docRef = await addDoc(collection(db, COLLECTIONS.THREADS), thread.toFirestore());
	return docRef.id;
}

export async function getThreadList() {
	let threadList = [];
	const q = query(collection(db, COLLECTIONS.THREADS), orderBy('timestamp', 'desc'));
	const snapShot = await getDocs(q);
	snapShot.forEach((doc) => {
		const t = new Thread(doc.data());
		t.set_docId(doc.id);
		threadList.push(t);
	});
	return threadList;
}

export async function getOneThread(threadId) {
	const docRef = doc(db, COLLECTIONS.THREADS, threadId);
	const docSnapshot = await getDoc(docRef);
	if (!docSnapshot.exists()) return null;
	const t = new Thread(docSnapshot.data());
	t.set_docId(threadId);
	return t;
}

export async function addReply(reply) {
	const docRef = await addDoc(collection(db, COLLECTIONS.REPLIES), reply.toFirestore());
	return docRef.id;
}

export async function getReplyList(threadId) {
	let replyList = [];
	const q = query(collection(db, COLLECTIONS.REPLIES), where('threadId', '==', threadId), orderBy('timestamp'));
	const snapShot = await getDocs(q);
	snapShot.forEach((doc) => {
		const r = new Reply(doc.data());
		r.set_docId(doc.id);
		replyList.push(r);
	});
	return replyList;
}

export async function searchThreads(keywordsArray) {
	const threadList = [];

	const q = query(collection(db, COLLECTIONS.THREADS), where('keywordsArray', 'array-contains-any', keywordsArray), orderBy('timestamp', 'desc'));
	const snapShot = await getDocs(q);

	snapShot.forEach((doc) => {
		const t = new Thread(doc.data());
		t.set_docId(doc.id);
		threadList.push(t);
	});
	return threadList;
}
