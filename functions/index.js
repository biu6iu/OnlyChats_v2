// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Cloud function that runs daily to check for inactive chats
exports.archiveInactiveChats = functions.pubsub
  .schedule('0 0 * * *') // Run once a day at midnight
  .onRun(async (context) => {
    const db = admin.firestore();
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    try {
      // Get all active (non-archived) prompts
      const promptsRef = db.collection('prompts');
      const activePromptsSnapshot = await promptsRef
        .where('archived', '==', false)
        .get();
      
      const batch = db.batch();
      let archivedCount = 0;
      
      // For each active prompt, check its last message
      for (const promptDoc of activePromptsSnapshot.docs) {
        const promptData = promptDoc.data();
        
        // Get the most recent message for this prompt
        const messagesRef = db.collection('messages');
        const lastMessageQuery = await messagesRef
          .where('promptId', '==', promptData.id)
          .orderBy('timestamp', 'desc')
          .limit(1)
          .get();
        
        if (lastMessageQuery.empty) {
          // If no messages, check the prompt creation date
          if (promptData.createdAt && promptData.createdAt.toDate() < twoDaysAgo) {
            batch.update(promptDoc.ref, { archived: true });
            archivedCount++;
          }
        } else {
          // Check if the last message is older than 2 days
          const lastMessage = lastMessageQuery.docs[0].data();
          if (lastMessage.timestamp && lastMessage.timestamp.toDate() < twoDaysAgo) {
            batch.update(promptDoc.ref, { archived: true });
            archivedCount++;
          }
        }
      }
      
      // Commit all the updates
      if (archivedCount > 0) {
        await batch.commit();
        console.log(`Archived ${archivedCount} inactive chats`);
      } else {
        console.log('No inactive chats to archive');
      }
      
      return null;
    } catch (error) {
      console.error('Error archiving inactive chats:', error);
      return null;
    }
  });

// Function that can be called manually to archive a specific chat
exports.archiveChat = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to archive chats'
    );
  }
  
  const promptId = data.promptId;
  if (!promptId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with a promptId argument'
    );
  }
  
  try {
    const db = admin.firestore();
    const promptsRef = db.collection('prompts');
    const promptQuery = await promptsRef.where('id', '==', promptId).get();
    
    if (promptQuery.empty) {
      throw new functions.https.HttpsError(
        'not-found',
        'No prompt found with the given ID'
      );
    }
    
    const promptDoc = promptQuery.docs[0];
    await promptDoc.ref.update({ archived: true });
    
    return { success: true, message: 'Chat archived successfully' };
  } catch (error) {
    console.error('Error archiving chat:', error);
    throw new functions.https.HttpsError(
      'internal',
      'An error occurred while archiving the chat'
    );
  }
});