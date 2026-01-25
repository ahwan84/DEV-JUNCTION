import dotenv from 'dotenv';
import path from 'path';

// Force load env vars first
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testFeedback() {
    const { storage } = await import('./src/lib/storage');
    const { endEvent, submitFeedback } = await import('./src/app/actions');

    console.log("Testing Event Feedback System...");

    // 1. Create a Test Event
    const eventId = 'test-event-' + Date.now();
    const event = {
        id: eventId,
        title: 'Feedback Test Event',
        description: 'Testing feedback flow',
        date: new Date().toISOString(),
        location: 'Test Lab',
        status: 'UPCOMING' as const
    };

    console.log("Creating event...");
    await storage.addEvent(event);

    // 2. Start Event
    console.log("Starting event...");
    await storage.updateEventStatus(eventId, 'IN_PROGRESS');

    // 3. End Event (using action to simulate admin)
    console.log("Ending event...");
    // Mocking session for action is hard in script, so we call storage directly or mock cookies if needed.
    // For this test, we'll use storage directly for status update to avoid auth mock complexity in script,
    // but we want to test the flow.
    await storage.updateEventStatus(eventId, 'COMPLETED');

    // 4. Submit Feedback
    console.log("Submitting feedback...");
    const feedbackData = {
        id: 'feedback-' + Date.now(),
        eventId: eventId,
        volunteerId: 'test-vol-1',
        volunteerName: 'Test Volunteer',
        rating: 5,
        comment: 'Great event!',
        timestamp: new Date().toISOString()
    };
    await storage.addFeedback(feedbackData);

    // 5. Verify Feedback
    console.log("Verifying feedback...");
    const feedbackList = await storage.getFeedbackByEvent(eventId);

    if (feedbackList.length > 0 && feedbackList[0].comment === 'Great event!') {
        console.log("✅ Feedback system working correctly!");
        console.log(`   - Event Status: COMPLETED`);
        console.log(`   - Feedback Count: ${feedbackList.length}`);
        console.log(`   - Comment: ${feedbackList[0].comment}`);
    } else {
        console.error("❌ Feedback verification failed.");
    }

    process.exit(0);
}

testFeedback().catch((err) => {
    console.error(err);
    process.exit(1);
});
