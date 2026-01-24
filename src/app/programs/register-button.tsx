'use client';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerForEvent } from "@/app/actions";

interface EventRegistrationButtonProps {
    eventId: string;
    eventTitle: string;
    isLoggedIn: boolean;
    eventStatus: string;
    isRegistered?: boolean;
}

export function EventRegistrationButton({ eventId, eventTitle, isLoggedIn, eventStatus, isRegistered = false }: EventRegistrationButtonProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleRegister = async () => {
        setIsLoading(true);
        setMessage(null);
        try {
            const result = await registerForEvent(eventId);
            if (result.success) {
                setMessage({ type: 'success', text: 'Successfully registered for this event!' });
                setTimeout(() => {
                    setOpen(false);
                    router.refresh(); // Refresh to update button state
                }, 1500);
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to register' });
            }
        } catch (e) {
            setMessage({ type: 'error', text: 'An unexpected error occurred' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleButtonClick = (e: React.MouseEvent) => {
        if (!isLoggedIn) {
            e.preventDefault();
            router.push('/login');
        }
    };

    // If Already Registered
    if (isRegistered) {
        return (
            <Button
                className="w-full justify-between bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                variant="ghost"
                disabled
            >
                <div>
                    Registered <span className="ml-1">✓</span>
                </div>
                {/* <ArrowUpRight className="h-4 w-4 opacity-0" /> Preserving layout if needed, but text center is fine */}
            </Button>
        );
    }

    if (!isLoggedIn) {
        return (
            <Button
                className="w-full justify-between group-hover:bg-primary group-hover:text-white transition-colors"
                variant={eventStatus === 'UPCOMING' ? 'default' : 'secondary'}
                disabled={eventStatus !== 'UPCOMING'}
                onClick={handleButtonClick}
            >
                {eventStatus === 'UPCOMING' ? 'Register to Volunteer' : 'Event Closed'}
                {eventStatus === 'UPCOMING' && <ArrowUpRight className="h-4 w-4" />}
            </Button>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="w-full justify-between group-hover:bg-primary group-hover:text-white transition-colors"
                    variant={eventStatus === 'UPCOMING' ? 'default' : 'secondary'}
                    disabled={eventStatus !== 'UPCOMING'}
                >
                    {eventStatus === 'UPCOMING' ? 'Register to Volunteer' : 'Event Closed'}
                    {eventStatus === 'UPCOMING' && <ArrowUpRight className="h-4 w-4" />}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Register for Event</DialogTitle>
                    <DialogDescription>
                        You are about to register to volunteer for: <strong>{eventTitle}</strong>.
                    </DialogDescription>
                </DialogHeader>

                {message && (
                    <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {message.text}
                    </div>
                )}

                <DialogFooter className="flex gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    {(!message || message.type === 'error') && (
                        <Button onClick={handleRegister} disabled={isLoading}>
                            {isLoading ? 'Registering...' : 'Confirm Registration'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
