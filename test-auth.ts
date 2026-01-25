import dotenv from 'dotenv';
import path from 'path';

// Force load env vars first
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testAuth() {
    // Dynamic import to ensure env vars are loaded before db connection init
    const { storage } = await import('./src/lib/storage');

    console.log("Testing Authentication...");

    // 1. Add Volunteer with password
    const vol = {
        id: 'auth-user-1',
        name: 'Auth User',
        email: 'auth@test.com',
        phone: '1234567890',
        skills: ['Testing'],
        availability: 'Weekends',
        status: 'PENDING',
        password: 'securepassword',
        joinedDate: new Date().toISOString()
    };

    console.log("Registering volunteer...");
    await storage.addVolunteer(vol as any); // Cast as any because types might be strict

    // 2. Mock Login Check
    const checkLogin = async (email: string, pass: string) => {
        const users = await storage.getVolunteers();
        const user = users.find((v: any) => v.email === email);

        if (!user) return { success: false, msg: 'User not found' };
        if (user.password !== pass) return { success: false, msg: 'Wrong password' };
        if (user.status !== 'APPROVED') return { success: false, msg: 'Pending approval' };

        return { success: true, msg: 'Login successful' };
    };

    // Test 1: Pending Login
    console.log("Test 1: Trying to login (Pending status)...");
    const res1 = await checkLogin('auth@test.com', 'securepassword');
    if (!res1.success && res1.msg === 'Pending approval') {
        console.log("✅ Correctly rejected pending user.");
    } else {
        console.error("❌ Failed pending check:", res1);
    }

    // Test 2: Approve and Login
    console.log("Test 2: Approving user and logging in...");
    await storage.updateVolunteer('auth-user-1', { status: 'APPROVED' });

    const res2 = await checkLogin('auth@test.com', 'securepassword');
    if (res2.success) {
        console.log("✅ Login successful for approved user.");
    } else {
        console.error("❌ Failed approved login:", res2);
    }

    // Test 3: Wrong Password
    console.log("Test 3: Wrong password check...");
    const res3 = await checkLogin('auth@test.com', 'wrongpass');
    if (!res3.success && res3.msg === 'Wrong password') {
        console.log("✅ Correctly rejected wrong password.");
    } else {
        console.error("❌ Failed password check:", res3);
    }

    console.log("Auth test complete.");
    process.exit(0);
}

testAuth().catch((err) => {
    console.error(err);
    process.exit(1);
});
