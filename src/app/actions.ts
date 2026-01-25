'use server';

import { storage } from "@/lib/storage";
import { Volunteer, Event, Announcement, EventUpdate, Staff, EventMetrics } from "@/types";
import { revalidatePath } from "next/cache";
import { cookies } from 'next/headers';
import Razorpay from 'razorpay';

// Volunteer Actions
export async function submitVolunteerApplication(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const skills = (formData.get('skills') as string).split(',').map(s => s.trim());
    const availability = formData.get('availability') as string;
    const password = formData.get('password') as string; // Capture password

    const volunteers = await storage.getVolunteers();
    const existingUser = volunteers.find(v => v.email === email);
    if (existingUser) {
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

    await storage.addVolunteer(newVolunteer);

    await storage.addAuditLog({
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

    const volunteers = await storage.getVolunteers();
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
    const volunteers = await storage.getVolunteers();
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

    await storage.updateVolunteer(user.id, { name, avatarUrl });

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
    await storage.updateVolunteer(user.id, { password });

    return { success: true };
}

export async function updateVolunteerStatus(id: string, status: 'APPROVED' | 'REJECTED') {
    await storage.updateVolunteer(id, { status });

    await storage.addAuditLog({
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

    await storage.addEvent(newEvent);

    await storage.addAuditLog({
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

export async function startEvent(eventId: string) {
    await storage.updateEventStatus(eventId, 'IN_PROGRESS');
    revalidatePath(`/programs/${eventId}/live`);
    revalidatePath('/programs');
    revalidatePath('/admin/events');
}

export async function endEvent(eventId: string) {
    await storage.updateEventStatus(eventId, 'COMPLETED');
    revalidatePath(`/programs/${eventId}/live`);
    revalidatePath('/programs');
    revalidatePath('/admin/events');
}

export async function postEventUpdate(eventId: string, formData: FormData) {
    const user = await getUserSession();
    if (!user) return { success: false, error: 'Not authenticated' };

    const content = formData.get('content') as string;
    // In a real app, handle image upload to S3/Blob storage here.
    // For MVP, we'll support external URLs or just ignore image if file is uploaded
    // or assume the user pastes a URL in a text field if that matches requirement.
    // Let's assume content is text for now, maybe add imageUrl later or via a simple URL input.
    // Wait, the prompt implies "one can start updating progress". Text + Image is best.
    // Let's check if the user uploaded an image. Simulating file upload is hard without cloud storage.
    // I will look for 'imageUrl' in formData (client can mock upload or provide URL).
    const imageUrl = formData.get('imageUrl') as string;

    const newUpdate: EventUpdate = {
        id: Math.random().toString(36).substring(7),
        eventId,
        content,
        authorId: user.id,
        authorName: user.name,
        timestamp: new Date().toISOString(),
        imageUrl: imageUrl || undefined
    };

    await storage.addEventUpdate(newUpdate);

    // Create audit log for updates? Maybe overkill, but good for tracking.
    // Skipping to keep noise down.

    revalidatePath(`/programs/${eventId}/live`);

    revalidatePath(`/admin/events/${eventId}/live`);
    return { success: true };
}

export async function updateEventMetrics(eventId: string, formData: FormData) {
    const user = await getUserSession();
    if (!user) return { success: false, error: 'Not authenticated' };

    // Parse metrics
    const metrics: EventMetrics = {
        peopleFed: Number(formData.get('peopleFed')) || 0,
        costBurnt: Number(formData.get('costBurnt')) || 0,
        partners: (formData.get('partners') as string || "").split(',').map(s => s.trim()).filter(Boolean)
    };

    await storage.updateEventMetrics(eventId, metrics);

    revalidatePath(`/programs/${eventId}/live`);
    revalidatePath(`/admin/events/${eventId}/live`);
    return { success: true };
}

export async function donateToEvent(eventId: string, amount: number) {
    const events = await storage.getEvents();
    const event = events.find(e => e.id === eventId);
    if (!event) return { success: false, error: 'Event not found' };

    const currentFundraising = event.fundraising || { goal: 5000, raised: 0 };
    const newFundraising = {
        ...currentFundraising,
        raised: currentFundraising.raised + amount
    };

    await storage.updateEventFundraising(eventId, newFundraising);

    // Also log donation... (skipped for brevity)

    revalidatePath('/programs');
    revalidatePath(`/programs/${eventId}/live`);
    return { success: true };
}

export async function getEventFeed(eventId: string) {
    return await storage.getEventUpdates(eventId);
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

    await storage.addAnnouncement(newAnnouncement);

    await storage.addAuditLog({
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
    const announcements = await storage.getAnnouncements();
    return announcements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function registerForEvent(eventId: string) {
    const user = await getUserSession();
    if (!user) return { success: false, error: 'Not authenticated' };

    const volunteers = await storage.getVolunteers();
    const volunteer = volunteers.find(v => v.id === user.id);

    if (volunteer) {
        const registered = volunteer.registeredEvents || [];
        if (registered.includes(eventId)) {
            return { success: false, error: 'Already registered' };
        }

        await storage.updateVolunteer(user.id, {
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

    const volunteers = await storage.getVolunteers();
    const volunteer = volunteers.find(v => v.id === user.id);

    if (!volunteer || !volunteer.registeredEvents) return [];

    const allEvents = await storage.getEvents();
    return allEvents.filter(e => volunteer.registeredEvents?.includes(e.id));
}

// --- Razorpay & Email ---

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

// --- Staff Management ---

export async function loginStaff(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    // 1. Check hardcoded admin (Bootstrapping)
    if (username === 'admin' && password === 'admin') {
        (await cookies()).set('admin_session', JSON.stringify({
            username: 'admin',
            role: 'SUPER_ADMIN',
            permissions: ['ALL']
        }), { path: '/' });
        return { success: true };
    }

    // 2. Check database staff
    const staff = await storage.getStaffByUsername(username);
    if (staff && staff.password === password) {
        (await cookies()).set('admin_session', JSON.stringify({
            username: staff.username,
            role: staff.role,
            permissions: staff.permissions
        }), { path: '/' });
        return { success: true };
    }

    return { success: false, error: 'Invalid credentials' };
}

export async function createStaff(formData: FormData) {
    const session = await getStaffSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
        return { success: false, error: 'Unauthorized' };
    }

    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    // permissions is a comma-separated string from the form
    const permissions = (formData.get('permissions') as string || '').split(',').filter(Boolean);

    const existing = await storage.getStaffByUsername(username);
    if (existing) {
        return { success: false, error: 'Username already exists' };
    }

    const newStaff: Staff = {
        id: Math.random().toString(36).substring(7),
        username,
        password,
        role: 'STAFF',
        permissions
    };

    await storage.addStaff(newStaff);
    revalidatePath('/admin/staff');
    return { success: true };
}

export async function getStaffSession() {
    const cookie = (await cookies()).get('admin_session');
    if (!cookie) return null;
    try {
        return JSON.parse(cookie.value);
    } catch (e) {
        return null;
    }
}

export async function logoutStaff() {
    (await cookies()).delete('admin_session');
    revalidatePath('/admin/login');
    revalidatePath('/');
}
