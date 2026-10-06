import {
  db,
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  handleFirestoreError,
  FirestoreOperationType,
  FirebaseUser,
} from '../lib/firebase';
import { LLNode, ListMode } from '../types/linkedList';

export interface SavedListDoc {
  id: string;
  userId: string;
  name: string;
  mode: ListMode;
  nodes: LLNode[];
  headId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserProgressDoc {
  userId: string;
  solvedChallenges: string[];
  completedChecklist: number[];
  updatedAt: string;
}

/**
 * Sync user profile to Firestore
 */
export async function syncUserProfile(user: FirebaseUser): Promise<void> {
  const path = `users/${user.uid}`;
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(
      userRef,
      {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Learner',
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, FirestoreOperationType.WRITE, path);
  }
}

/**
 * Fetch user progress (solved challenges and completed textbook checklist)
 */
export async function fetchUserProgress(userId: string): Promise<UserProgressDoc | null> {
  const path = `users/${userId}/progress/default`;
  try {
    const progressRef = doc(db, 'users', userId, 'progress', 'default');
    const snap = await getDoc(progressRef);
    if (snap.exists()) {
      return snap.data() as UserProgressDoc;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, FirestoreOperationType.GET, path);
  }
}

/**
 * Save user progress to Firestore
 */
export async function saveUserProgress(
  userId: string,
  solvedChallenges: string[],
  completedChecklist: number[]
): Promise<void> {
  const path = `users/${userId}/progress/default`;
  try {
    const progressRef = doc(db, 'users', userId, 'progress', 'default');
    await setDoc(
      progressRef,
      {
        userId,
        solvedChallenges,
        completedChecklist,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, FirestoreOperationType.WRITE, path);
  }
}

/**
 * Fetch all saved linked lists for a user
 */
export async function fetchUserSavedLists(userId: string): Promise<SavedListDoc[]> {
  const path = `users/${userId}/savedLists`;
  try {
    const colRef = collection(db, 'users', userId, 'savedLists');
    const snap = await getDocs(colRef);
    const lists: SavedListDoc[] = [];
    snap.forEach((docSnap) => {
      lists.push(docSnap.data() as SavedListDoc);
    });
    return lists.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch (error) {
    handleFirestoreError(error, FirestoreOperationType.LIST, path);
  }
}

/**
 * Save or update a linked list configuration in Firestore
 */
export async function saveLinkedListToFirestore(
  userId: string,
  params: {
    id?: string;
    name: string;
    mode: ListMode;
    nodes: LLNode[];
    headId: string | null;
  }
): Promise<string> {
  const listId = params.id || 'list_' + Math.random().toString(36).substring(2, 10);
  const path = `users/${userId}/savedLists/${listId}`;
  try {
    const now = new Date().toISOString();
    const docRef = doc(db, 'users', userId, 'savedLists', listId);
    const payload: SavedListDoc = {
      id: listId,
      userId,
      name: params.name.trim().slice(0, 100) || 'Untitled List',
      mode: params.mode,
      nodes: params.nodes,
      headId: params.headId,
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(docRef, payload);
    return listId;
  } catch (error) {
    handleFirestoreError(error, FirestoreOperationType.WRITE, path);
  }
}

/**
 * Delete a saved linked list from Firestore
 */
export async function deleteSavedListFromFirestore(userId: string, listId: string): Promise<void> {
  const path = `users/${userId}/savedLists/${listId}`;
  try {
    const docRef = doc(db, 'users', userId, 'savedLists', listId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, FirestoreOperationType.DELETE, path);
  }
}

export interface ChatSessionDoc {
  id: string;
  userId: string;
  title: string;
  role: string;
  model: string;
  messages: Array<{
    id: string;
    role: 'user' | 'model';
    content: string;
    timestamp: string;
  }>;
  updatedAt: string;
}

/**
 * Save chat session to Firestore
 */
export async function saveChatSessionToFirestore(
  userId: string,
  session: {
    id: string;
    title: string;
    role: string;
    model: string;
    messages: Array<{
      id: string;
      role: 'user' | 'model';
      content: string;
      timestamp: string;
    }>;
  }
): Promise<void> {
  const path = `users/${userId}/chats/${session.id}`;
  try {
    const chatRef = doc(db, 'users', userId, 'chats', session.id);
    const payload: ChatSessionDoc = {
      id: session.id,
      userId,
      title: session.title.slice(0, 120),
      role: session.role,
      model: session.model,
      messages: session.messages,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(chatRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, FirestoreOperationType.WRITE, path);
  }
}

/**
 * Fetch all chat sessions for a user
 */
export async function fetchUserChatSessions(userId: string): Promise<ChatSessionDoc[]> {
  const path = `users/${userId}/chats`;
  try {
    const colRef = collection(db, 'users', userId, 'chats');
    const snap = await getDocs(colRef);
    const sessions: ChatSessionDoc[] = [];
    snap.forEach((docSnap) => {
      sessions.push(docSnap.data() as ChatSessionDoc);
    });
    return sessions.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch (error) {
    handleFirestoreError(error, FirestoreOperationType.LIST, path);
  }
}

/**
 * Delete chat session from Firestore
 */
export async function deleteChatSessionFromFirestore(userId: string, chatId: string): Promise<void> {
  const path = `users/${userId}/chats/${chatId}`;
  try {
    const docRef = doc(db, 'users', userId, 'chats', chatId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, FirestoreOperationType.DELETE, path);
  }
}
