import dotenv from 'dotenv';
import path from 'path';

// Force load env vars first
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testLiveUpdates() {
    const { storage } = await import('./src/lib/storage');
    // We need to mock cookies for actions, but since we can't easily mock next/headers cookies in this script,
    // we will test the storage logic directly or use a modified action approach if possible.
    // However, the issue was likely in the action's session check.
    // Since we can't run server actions with real cookies here, we will simulate the logic:
    // 1. Create event
    // 2. Add update manually (simulating what the action does now)
    // 3. Verify it comes back in getEventUpdates

    console.log("Testing Live Updates...");

    const eventId = 'live-test-' + Date.now();
    const event = {
        id: eventId,
        title: 'Live Update Test',
        description: 'Testing live feed',
        date: new Date().toISOString(),
        location: 'Test Lab',
        status: 'IN_PROGRESS' as const
    };

    await storage.addEvent(event);
    console.log("Event created and started.");

    // Simulate Admin Post
    const adminUpdate = {
        id: 'update-' + Date.now(),
        eventId: eventId,
        content: 'Admin update test',
        authorId: 'ADMIN',
        authorName: 'Event Admin',
        timestamp: new Date().toISOString()
    };

    await storage.addEventUpdate(adminUpdate);
    console.log("Admin update added.");

    // Verify
    const updates = await storage.getEventUpdates(eventId);
    if (updates.length > 0 && updates[0].content === 'Admin update test') {
        console.log("✅ Updates retrieved successfully.");
    } else {
        console.error("❌ Failed to retrieve updates.");
    }

    // Test Metrics Update (Storage level)
    const metrics = {
        peopleFed: 100,
        costBurnt: 5000,
        partners: ['Partner A']
    };
    await storage.updateEventMetrics(eventId, metrics);

    const updatedEvents = await storage.getEvents();
    const updatedEvent = updatedEvents.find(e => e.id === eventId);

    if (updatedEvent?.metrics?.peopleFed === 100) {
        console.log("✅ Metrics updated successfully.");
    } else {
        console.error("❌ Failed to update metrics.");
    }

    process.exit(0);
}

testLiveUpdates().catch((err) => {
    console.error(err);
    process.exit(1);
});
