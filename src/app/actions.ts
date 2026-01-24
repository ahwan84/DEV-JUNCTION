'use server';

import { storage } from "@/lib/storage";
import { Volunteer, Event, Announcement } from "@/types";
import { revalidatePath } from "next/cache";
import { cookies } from 'next/headers';

// Volunteer Actions
export async function submitVolunteerApplication(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const skills = (formData.get('skills') as string).split(',').map(s => s.trim());
    const availability = formData.get('availability') as string;
    const password = formData.get('password') as string; // Capture password

    const existingUser = storage.getVolunteers().find(v => v.email === email);
    if (existingUser) {
        // ideally return error, but server action return type needs to change or handle it client side
        // For MVP, if we return {success: false, error: ...}, the client needs to show it.
        // The current client expects void or throws?
        // Let's check client code.
        return { success: false, error: 'Email already registered' };
    }

    const newVolunteer: Volunteer = {
        id: Math.random().toString(36).substring(7),
        name,
        email,
        phone,
        skills,
        availability,
        status: 'PENDING',
        password, // Store password
        joinedDate: new Date().toISOString(),
    };

    storage.addVolunteer(newVolunteer);

    storage.addAuditLog({
        id: Math.random().toString(36).substring(7),
        action: 'VOLUNTEER_APPLICATION',
        details: `New application from ${name}`,
        adminId: 'SYSTEM',
        timestamp: new Date().toISOString(),
    });

    revalidatePath('/admin/volunteers');
    return { success: true };
}

export async function loginUser(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const volunteers = storage.getVolunteers();
    const user = volunteers.find(v => v.email === email);

    if (!user) {
        return { success: false, error: 'Invalid credentials' };
    }

    if (user.password !== password) {
        return { success: false, error: 'Invalid credentials' };
    }

    if (user.status !== 'APPROVED') {
        return { success: false, error: 'Your account is pending approval' };
    }

    // Set cookie
    (await cookies()).set('user_session', email, { path: '/' });

    return { success: true };
}

export async function getUserSession() {
    const sessionCookie = (await cookies()).get('user_session');
    if (!sessionCookie) return null;

    const email = sessionCookie.value;
    const volunteers = storage.getVolunteers();
    const user = volunteers.find(v => v.email === email);

    // For safety, don't return password
    if (user) {
        const { password, ...safeUser } = user;
        return safeUser;
    }
    return null;
}

export async function logoutUser() {
    (await cookies()).delete('user_session');
    revalidatePath('/');
}

export async function updateUserProfile(formData: FormData) {
    const user = await getUserSession();
    if (!user) return { success: false, error: 'Not authenticated' };

    const name = formData.get('name') as string;
    const avatarUrl = formData.get('avatarUrl') as string;

    storage.updateVolunteer(user.id, { name, avatarUrl });

    revalidatePath('/');
    return { success: true };
}

export async function updatePassword(formData: FormData) {
    const user = await getUserSession();
    if (!user) return { success: false, error: 'Not authenticated' };

    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
        return { success: false, error: 'Passwords do not match' };
    }

    if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
    }

    // In a real app, hash this!
    storage.updateVolunteer(user.id, { password });

    return { success: true };
}

export async function updateVolunteerStatus(id: string, status: 'APPROVED' | 'REJECTED') {
    storage.updateVolunteer(id, { status });

    storage.addAuditLog({
        id: Math.random().toString(36).substring(7),
        action: 'VOLUNTEER_STATUS_UPDATE',
        details: `Volunteer ${id} status updated to ${status}`,
        adminId: 'ADMIN', // Mock admin ID
        timestamp: new Date().toISOString(),
    });

    revalidatePath('/admin/volunteers');
    revalidatePath('/admin/dashboard');
}

// Event Actions
export async function createEvent(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const date = formData.get('date') as string;
    const location = formData.get('location') as string;

    const newEvent: Event = {
        id: Math.random().toString(36).substring(7),
        title,
        description,
        date: new Date(date).toISOString(),
        location,
        status: 'UPCOMING',
    };

    storage.addEvent(newEvent);

    storage.addAuditLog({
        id: Math.random().toString(36).substring(7),
        action: 'EVENT_CREATED',
        details: `New event created: ${title}`,
        adminId: 'ADMIN',
        timestamp: new Date().toISOString(),
    });

    revalidatePath('/admin/events');
    revalidatePath('/programs');
    revalidatePath('/');
}

// Announcement Actions
export async function createAnnouncement(formData: FormData) {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    const newAnnouncement: Announcement = {
        id: Math.random().toString(36).substring(7),
        title,
        content,
        date: new Date().toISOString(),
        author: 'Admin',
    };

    storage.addAnnouncement(newAnnouncement);

    storage.addAuditLog({
        id: Math.random().toString(36).substring(7),
        action: 'ANNOUNCEMENT_CREATED',
        details: `New announcement: ${title}`,
        adminId: 'ADMIN',
        timestamp: new Date().toISOString(),
    });

    revalidatePath('/admin/announcements');
    revalidatePath('/');
}

export async function getAnnouncements() {
    return storage.getAnnouncements().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function registerForEvent(eventId: string) {
    const user = await getUserSession();
    if (!user) return { success: false, error: 'Not authenticated' };

    const volunteers = storage.getVolunteers();
    const volunteer = volunteers.find(v => v.id === user.id);

    if (volunteer) {
        const registered = volunteer.registeredEvents || [];
        if (registered.includes(eventId)) {
            return { success: false, error: 'Already registered' };
        }

        storage.updateVolunteer(user.id, {
            registeredEvents: [...registered, eventId]
        });

        revalidatePath('/dashboard');
        revalidatePath('/programs');
        return { success: true };
    }
    return { success: false, error: 'User not found' };
}

export async function getRegisteredEvents() {
    const user = await getUserSession();
    if (!user) return [];

    const volunteers = storage.getVolunteers();
    const volunteer = volunteers.find(v => v.id === user.id);

    if (!volunteer || !volunteer.registeredEvents) return [];

    const allEvents = storage.getEvents();
    return allEvents.filter(e => volunteer.registeredEvents?.includes(e.id));
}

// --- Razorpay & Email ---

import Razorpay from 'razorpay';

export async function createRazorpayOrder(amount: number) {
    try {
        // Initialize Razorpay with env vars (fallback to mock if not present)
        const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;

        // If keys are placeholders or missing, use mock
        if (!key_id || !key_secret || key_id.includes('placeholder')) {
            console.log("Mocking Razorpay Order", { amount });
            return {
                success: true,
                orderId: "order_mock_" + Math.random().toString(36).substring(7),
                amount: amount * 100,
                currency: "INR",
                key: key_id || 'test_key',
                isMock: true
            };
        }

        const instance = new Razorpay({
            key_id: key_id,
            key_secret: key_secret,
        });

        const options = {
            amount: amount * 100, // amount in paisa
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };

        const order = await instance.orders.create(options);
        return { success: true, orderId: order.id, amount: order.amount, currency: order.currency, key: key_id };
    } catch (error) {
        console.error("Razorpay Error:", error);
        return { success: false, error: "Failed to create payment order" };
    }
}

export async function sendThankYouEmail(email: string, name: string, amount: number) {
    // In a real app, use Nodemailer or an API like Resend/SendGrid
    console.log(`
    [EMAIL SERVER MOCK] 
    To: ${email}
    Subject: Thank You for Your Donation to HopeConnect!
    
    Dear ${name},
    
    Thank you for your generous donation of ₹${amount}. Your support helps us to continue our mission.
    
    Receipt ID: #RCPT-${Date.now()}
    Date: ${new Date().toLocaleDateString()}
    
    Sincerely,
    The HopeConnect Team
    `);

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
}
