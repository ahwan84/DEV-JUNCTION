
const { storage } = require('./src/lib/storage');

async function testAuth() {
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
    storage.addVolunteer(vol);

    // 2. Mock Login Check (Client side simulation)
    const checkLogin = (email, pass) => {
        const users = storage.getVolunteers();
        const user = users.find(v => v.email === email);

        if (!user) return { success: false, msg: 'User not found' };
        if (user.password !== pass) return { success: false, msg: 'Wrong password' };
        if (user.status !== 'APPROVED') return { success: false, msg: 'Pending approval' };

        return { success: true, msg: 'Login successful' };
    };

    // Test 1: Pending Login
    console.log("Test 1: Trying to login (Pending status)...");
    const res1 = checkLogin('auth@test.com', 'securepassword');
    if (!res1.success && res1.msg === 'Pending approval') {
        console.log("✅ Correctly rejected pending user.");
    } else {
        console.error("❌ Failed pending check:", res1);
    }

    // Test 2: Approve and Login
    console.log("Test 2: Approving user and logging in...");
    storage.updateVolunteer('auth-user-1', { status: 'APPROVED' });

    const res2 = checkLogin('auth@test.com', 'securepassword');
    if (res2.success) {
        console.log("✅ Login successful for approved user.");
    } else {
        console.error("❌ Failed approved login:", res2);
    }

    // Test 3: Wrong Password
    console.log("Test 3: Wrong password check...");
    const res3 = checkLogin('auth@test.com', 'wrongpass');
    if (!res3.success && res3.msg === 'Wrong password') {
        console.log("✅ Correctly rejected wrong password.");
    } else {
        console.error("❌ Failed password check:", res3);
    }

    console.log("Auth test complete.");
}

testAuth().catch(console.error);
