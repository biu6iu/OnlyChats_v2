import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit, 
  updateDoc,
  writeBatch,
  doc
} from 'firebase/firestore';

/**
 * Checks if a chat should be archived based on inactivity
 * @param promptId The ID of the prompt to check
 * @returns true if the chat should be archived, false otherwise
 */
export const shouldArchiveChat = async (promptId: number): Promise<boolean> => {
  try {
    // Calculate the date 2 days ago
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    // Get the most recent message for this prompt
    const messagesRef = collection(db, 'messages');
    const lastMessageQuery = query(
      messagesRef,
      where('promptId', '==', promptId),
      orderBy('timestamp', 'desc'),
      limit(1)
    );
    
    const lastMessageSnapshot = await getDocs(lastMessageQuery);
    
    if (lastMessageSnapshot.empty) {
      // If no messages, check the prompt creation date
      const promptsRef = collection(db, 'prompts');
      const promptQuery = query(promptsRef, where('id', '==', promptId));
      const promptSnapshot = await getDocs(promptQuery);
      
      if (!promptSnapshot.empty) {
        const promptData = promptSnapshot.docs[0].data();
        if (promptData.createdAt && promptData.createdAt.toDate() < twoDaysAgo) {
          return true;
        }
      }
      return false;
    }
    
    // Check if the last message is older than 2 days
    const lastMessage = lastMessageSnapshot.docs[0].data();
    if (lastMessage.timestamp && lastMessage.timestamp.toDate() < twoDaysAgo) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking if chat should be archived:', error);
    return false;
  }
};

/**
 * Archives a chat by setting its archived flag to true
 * @param promptId The ID of the prompt to archive
 * @returns true if successful, false otherwise
 */
export const archiveChat = async (promptId: number): Promise<boolean> => {
  try {
    const promptsRef = collection(db, 'prompts');
    const promptQuery = query(promptsRef, where('id', '==', promptId));
    const promptSnapshot = await getDocs(promptQuery);
    
    if (promptSnapshot.empty) {
      console.error('No prompt found with ID:', promptId);
      return false;
    }
    
    const promptDoc = promptSnapshot.docs[0];
    await updateDoc(promptDoc.ref, { archived: true });
    
    console.log('Successfully archived chat:', promptId);
    return true;
  } catch (error) {
    console.error('Error archiving chat:', error);
    return false;
  }
};

/**
 * Checks all active chats and archives those that have been inactive for over 2 days
 * @returns The number of chats that were archived
 */
export const checkAndArchiveInactiveChats = async (): Promise<number> => {
  try {
    const promptsRef = collection(db, 'prompts');
    const activePromptsQuery = query(promptsRef, where('archived', '==', false));
    const activePromptsSnapshot = await getDocs(activePromptsQuery);
    
    if (activePromptsSnapshot.empty) {
      return 0;
    }
    
    let archivedCount = 0;
    const batch = writeBatch(db);
    
    for (const promptDoc of activePromptsSnapshot.docs) {
      const promptData = promptDoc.data();
      const shouldArchive = await shouldArchiveChat(promptData.id);
      
      if (shouldArchive) {
        batch.update(promptDoc.ref, { archived: true });
        archivedCount++;
      }
    }
    
    if (archivedCount > 0) {
      await batch.commit();
      console.log(`Archived ${archivedCount} inactive chats`);
    }
    
    return archivedCount;
  } catch (error) {
    console.error('Error checking and archiving inactive chats:', error);
    return 0;
  }
};