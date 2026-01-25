export type VolunteerStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Volunteer {
    id: string;
    name: string;
    email: string;
    phone: string;
    skills: string[];
    availability: string;
    status: VolunteerStatus;
    password?: string; // Optional for migration, required for new
    avatarUrl?: string;
    reviews?: Review[];
    rating?: number;
    joinedDate: string;
    registeredEvents?: string[]; // IDs of events
    points?: number; // Leaderboard points
}

export interface Review {
    id: string;
    author: string;
    rating: number; // 1-5
    comment: string;
    date: string;
}

export interface EventMetrics {
    peopleFed?: number;
    costBurnt?: number;
    partners?: string[];
}

export interface EventFundraising {
    goal: number;
    raised: number;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    status: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    metrics?: EventMetrics;
    fundraising?: EventFundraising;
}

export interface EventUpdate {
    id: string;
    eventId: string;
    content: string;
    authorId: string;
    authorName: string;
    timestamp: string;
    imageUrl?: string;
}

export interface Donation {
    id: string;
    donorName: string;
    donorEmail: string;
    amount: number;
    date: string;
    campaignId?: string; // Optional link to specific cause
    receiptId: string;
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    date: string;
    author: string;
}

export interface AuditLog {
    id: string;
    action: string;
    details: string;
    adminId: string; // For MVP this might just be "admin"
    timestamp: string;
}

export interface Admin {
    id: string;
    username: string;
    role: 'SUPER_ADMIN' | 'EDITOR';
}

export interface Staff {
    id: string;
    username: string;
    password?: string;
    role: 'SUPER_ADMIN' | 'STAFF';
    permissions: string[]; // 'VIEW_AUDITS', 'APPROVE_USERS'
}
