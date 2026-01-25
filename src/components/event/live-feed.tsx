'use client';

import { useEffect, useState } from "react";
import { EventUpdate } from "@/types";
import { getEventFeed } from "@/app/actions";
import Image from "next/image";
import { Clock } from "lucide-react";

interface LiveFeedProps {
    eventId: string;
    initialUpdates: EventUpdate[];
    isLive: boolean; // If not live, maybe stop polling
}

export function LiveFeed({ eventId, initialUpdates, isLive }: LiveFeedProps) {
    const [updates, setUpdates] = useState<EventUpdate[]>(initialUpdates);

    useEffect(() => {
        if (!isLive) return;

        // Poll every 5 seconds
        const interval = setInterval(async () => {
            try {
                const freshUpdates = await getEventFeed(eventId);
                // Simple equality check logic or just replace
                // Ideally, check for new IDs. Replacing entire array is fine for MVP size logic.
                setUpdates(freshUpdates);
            } catch (error) {
                console.error("Error polling updates:", error);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [eventId, isLive]);

    if (updates.length === 0) {
        return (
            <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed">
                <p>No activity yet. Updates will appear here in real-time once the event starts!</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {updates.map((update) => (
                <div key={update.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                    {/* Icon on the line */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-slate-500">
                        <Clock className="w-4 h-4" />
                    </div>

                    {/* Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between space-x-2 mb-2">
                            <div className="font-bold text-slate-900">{update.authorName}</div>
                            <time className="font-mono text-xs text-slate-500">
                                {new Date(update.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </time>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-3">
                            {update.content}
                        </p>
                        {update.imageUrl && (
                            <div className="relative h-48 w-full rounded-lg overflow-hidden border border-slate-100">
                                <Image
                                    src={update.imageUrl}
                                    alt="Update attachment"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
