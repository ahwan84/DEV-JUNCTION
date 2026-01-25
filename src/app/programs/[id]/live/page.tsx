import { storage } from "@/lib/storage";
import { getUserSession, getStaffSession } from "@/app/actions";
import { LiveFeed } from "@/components/event/live-feed";
import { UpdateForm } from "@/components/event/update-form";
import { MetricsForm } from "@/components/event/metrics-form";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, GripHorizontal, MapPin, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function LiveEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const events = await storage.getEvents();
    const event = events.find(e => e.id === id);

    if (!event) return notFound();

    const user = await getUserSession();
    const staffSession = await getStaffSession();
    const isAdmin = !!staffSession;

    // Check if user is registered for this event to allow posting
    const volunteers = await storage.getVolunteers();
    const volunteer = user ? volunteers.find(v => v.id === user.id) : null;
    const isRegistered = volunteer?.registeredEvents?.includes(id);

    // Initial data for SSR
    const updates = await storage.getEventUpdates(id);
    const isLive = event.status === 'IN_PROGRESS';

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Live Header */}
            <div className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
                <div className="container mx-auto py-4 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/programs" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    {isLive ? (
                                        <>
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                        </>
                                    ) : (
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-500"></span>
                                    )}
                                </span>
                                <h1 className="font-bold text-lg md:text-xl line-clamp-1">{event.title}</h1>
                            </div>
                            <p className="text-xs text-slate-400 pl-5">
                                {isLive ? 'Live Coverage' : 'Event Feed'}
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                        <Share2 className="w-5 h-5" />
                    </Button>
                    <Link href={`/donate?eventId=${id}`} className="ml-2">
                        <Button className="bg-red-500 hover:bg-red-600 text-white border-0">
                            Donate
                        </Button>
                    </Link>
                </div>
            </div>

            <main className="container mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Available for Updates Form (Left/Top) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Event Info Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-2xl font-bold mb-4">Event Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 mb-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                {event.location}
                            </div>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            {event.description}
                        </p>
                    </div>

                    {/* Live Feed */}
                    <div>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <GripHorizontal className="w-5 h-5 text-slate-400" />
                            Timeline
                        </h2>

                        <LiveFeed
                            eventId={id}
                            initialUpdates={updates}
                            isLive={isLive}
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Show forms if:
                        1. Event is Live AND
                        2. (User is Admin OR User is Registered Volunteer)
                    */}
                    {isLive && (isAdmin || isRegistered) ? (
                        <div className="sticky top-24">
                            <UpdateForm eventId={id} />

                            {isRegistered && !isAdmin && (
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 mb-6">
                                    <p className="font-semibold mb-1">You are a confirmed volunteer!</p>
                                    <p>Share your photos and updates directly to the timeline.</p>
                                </div>
                            )}

                            {/* Only Admins can update metrics */}
                            {isAdmin && (
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6">
                                    <h3 className="font-bold text-slate-900 mb-3">Update Metrics</h3>
                                    <p className="text-xs text-slate-500 mb-4">Help us track our impact in real-time.</p>
                                    <MetricsForm eventId={id} metrics={event.metrics} />
                                </div>
                            )}
                        </div>
                    ) : (
                        !isLive && event.status === 'UPCOMING' && (
                            <div className="bg-slate-100 p-6 rounded-xl text-center text-slate-500">
                                <p>Live updates will begin once the event starts.</p>
                            </div>
                        )
                    )}
                </div>
            </main>
        </div>
    );
}
