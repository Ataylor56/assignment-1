import { collection, getFirestore, addDoc, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js';
import { COLLECTIONS } from '../model/constants.js';
import { Thread } from '../model/thread.js';

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
