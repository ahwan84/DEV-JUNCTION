'use client';

import { Button } from "@/components/ui/button";
import { updateEventMetrics } from "@/app/actions";
import { EventMetrics } from "@/types";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface MetricsFormProps {
    eventId: string;
    metrics?: EventMetrics;
}

export function MetricsForm({ eventId, metrics }: MetricsFormProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsUpdating(true);
        formData.append('eventId', eventId);
        await updateEventMetrics(eventId, formData);
        setIsUpdating(false);
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">People Fed / Impacted</label>
                <input
                    name="peopleFed"
                    type="number"
                    defaultValue={metrics?.peopleFed || 0}
                    className="w-full mt-1 p-2 border rounded-md text-sm"
                />
            </div>
            <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Cost Burnt (₹)</label>
                <input
                    name="costBurnt"
                    type="number"
                    defaultValue={metrics?.costBurnt || 0}
                    className="w-full mt-1 p-2 border rounded-md text-sm"
                />
            </div>
            <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Partners (comma sep)</label>
                <input
                    name="partners"
                    type="text"
                    defaultValue={metrics?.partners?.join(', ') || ""}
                    className="w-full mt-1 p-2 border rounded-md text-sm"
                />
            </div>
            <Button type="submit" variant="outline" size="sm" className="w-full" disabled={isUpdating}>
                {isUpdating ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : null}
                Update Metrics
            </Button>
        </form>
    );
}
