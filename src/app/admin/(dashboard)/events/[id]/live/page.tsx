import { storage } from "@/lib/storage";
import { LiveFeed } from "@/components/event/live-feed";
import { startEvent, endEvent, updateEventMetrics } from "@/app/actions";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MetricsForm } from "@/components/event/metrics-form";
import { Play, StopCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AdminLiveEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const events = await storage.getEvents();
    const event = events.find(e => e.id === id);

    if (!event) return notFound();

    const updates = await storage.getEventUpdates(id);
    const isLive = event.status === 'IN_PROGRESS';

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/events" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">Live Control Room</h1>
                    <p className="text-slate-500 text-sm">Managing: {event.title}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <h2 className="text-lg font-bold mb-4">Live Feed Monitoring</h2>
                        <LiveFeed
                            eventId={id}
                            initialUpdates={updates}
                            isLive={isLive}
                        />
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border sticky top-6">
                        <h2 className="text-lg font-bold mb-4">Event Status</h2>

                        <div className="space-y-4">
                            <div className={`p-4 rounded-lg flex items-center justify-between ${isLive ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-50 text-slate-600 border border-slate-200'
                                }`}>
                                <span className="font-medium">Current Status:</span>
                                <span className="font-bold uppercase">{event.status.replace('_', ' ')}</span>
                            </div>

                            {event.status === 'UPCOMING' && (
                                <form action={async () => {
                                    'use server';
                                    await startEvent(id);
                                }}>
                                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" size="lg">
                                        <Play className="w-5 h-5 mr-2" />
                                        Start Event Live
                                    </Button>
                                    <p className="text-xs text-slate-500 mt-2 text-center">
                                        This will enable volunteers to post updates.
                                    </p>
                                </form>
                            )}

                            {isLive && (
                                <form action={async () => {
                                    'use server';
                                    await endEvent(id);
                                }}>
                                    <Button type="submit" variant="destructive" className="w-full" size="lg">
                                        <StopCircle className="w-5 h-5 mr-2" />
                                        End Event
                                    </Button>
                                    <p className="text-xs text-slate-500 mt-2 text-center">
                                        This will archive the session and stop updates.
                                    </p>
                                </form>
                            )}

                            {event.status === 'COMPLETED' && (
                                <div className="text-center p-4 bg-slate-50 rounded-lg text-slate-500 italic">
                                    Event has ended. No further updates allowed.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <h2 className="text-lg font-bold mb-4">Impact Metrics</h2>
                        <MetricsForm eventId={id} metrics={event.metrics} />
                    </div>
                </div>
            </div>
        </div>
    );
}
