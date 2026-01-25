'use client';

import { useState } from 'react';
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
import { submitFeedback } from '@/app/actions';
import { Star } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface FeedbackFormProps {
    eventId: string;
    eventTitle: string;
}

export function FeedbackForm({ eventId, eventTitle }: FeedbackFormProps) {
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        formData.append('eventId', eventId);
        formData.append('rating', rating.toString());

        try {
            await submitFeedback(formData);
            setOpen(false);
        } catch (error) {
            console.error("Failed to submit feedback", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">Give Feedback</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Feedback for {eventTitle}</DialogTitle>
                    <DialogDescription>
                        Rate your experience and let us know how we can improve.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4">
                    <div className="flex flex-col items-center gap-2 py-4">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none transition-transform hover:scale-110"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                >
                                    <Star
                                        className={`h-8 w-8 ${star <= (hoverRating || rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-slate-300"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {rating > 0 ? `You rated this ${rating} stars` : "Click to rate"}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="comment" className="text-sm font-medium">
                            Comments
                        </label>
                        <Textarea
                            id="comment"
                            name="comment"
                            placeholder="Share your thoughts about the event..."
                            required
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting || rating === 0}>
                            {isSubmitting ? "Submitting..." : "Submit Feedback"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
