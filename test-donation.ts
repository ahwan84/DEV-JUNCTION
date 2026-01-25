import dotenv from 'dotenv';
import path from 'path';

// Force load env vars first
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testDonation() {
    const { storage } = await import('./src/lib/storage');
    const { processDonation } = await import('./src/app/actions');

    console.log("Testing Donation Flow...");

    // 1. Create Test Event
    const eventId = 'donation-test-' + Date.now();
    const event = {
        id: eventId,
        title: 'Donation Test Event',
        description: 'Testing fundraising',
        date: new Date().toISOString(),
        location: 'Test Lab',
        status: 'UPCOMING' as const,
        fundraising: {
            goal: 10000,
            raised: 0
        }
    };

    await storage.addEvent(event);
    console.log("Event created.");

    // 2. Process Donation
    const donationData = {
        amount: 500,
        donorName: 'Test Donor',
        donorEmail: 'test@example.com',
        eventId: eventId
    };

    console.log("Processing donation...");
    // We can call the action directly as it doesn't strictly depend on cookies for this part (except email mock which is fine)
    // Actually processDonation calls sendThankYouEmail which is just a console log mock.
    try {
        const result = await processDonation(donationData);
        if (result.success) {
            console.log("✅ Donation processed successfully.");
        }
    } catch (error) {
        console.log("⚠️ Donation action threw an error (likely revalidatePath), checking DB anyway...");
        console.error(error);
    }

    // 3. Verify Event Fundraising
    const events = await storage.getEvents();
    const updatedEvent = events.find(e => e.id === eventId);

    if (updatedEvent?.fundraising?.raised === 500) {
        console.log("✅ Event fundraising updated correctly (Raised: 500).");
    } else {
        console.error(`❌ Event fundraising mismatch. Expected 500, got ${updatedEvent?.fundraising?.raised}`);
    }

    // 4. Verify Donation Record
    const donations = await storage.getDonations();
    const donationRecord = donations.find(d => d.campaignId === eventId);

    if (donationRecord && donationRecord.amount === 500) {
        console.log("✅ Donation record found in database.");
    } else {
        console.error("❌ Donation record not found.");
    }

    process.exit(0);
}

testDonation().catch((err) => {
    console.error(err);
    process.exit(1);
});
