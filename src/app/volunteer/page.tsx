'use client';

import { Button } from "@/components/ui/button";
import { submitVolunteerApplication } from "@/app/actions";
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Captcha } from "@/components/ui/captcha";
// I'll use the existing pattern of error state but add captcha check.

export default function VolunteerPage() {
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [captchaVerified, setCaptchaVerified] = useState(false);

    const [error, setError] = useState('');

    async function handleSubmit(formData: FormData) {
        if (!captchaVerified) {
            setError("Please complete the captcha verification.");
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const result = await submitVolunteerApplication(formData);
            if (result.success) {
                setSubmitted(true);
            } else {
                setError(result.error || 'Something went wrong');
            }
        } catch (e) {
            setError('Failed to submit application');
        } finally {
            setIsSubmitting(false);
        }
    }

    if (submitted) {
        return (
            <div className="container mx-auto py-20 max-w-2xl text-center">
                <div className="mb-6 flex justify-center">
                    <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <CheckCircle className="h-10 w-10" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold mb-4">Application Received!</h1>
                <p className="text-muted-foreground mb-8">
                    Thank you for your interest in volunteering with HopeConnect. We have received your application and will get back to you within 2-3 business days.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="outline">Return Home</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 max-w-2xl">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold mb-4">Become a Volunteer</h1>
                <p className="text-muted-foreground">Join our community of changemakers.</p>
            </div>

            <div className="bg-white border rounded-xl p-8 shadow-sm">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}
                <form action={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                            <input required name="name" id="name" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                            <input required name="email" id="email" type="email" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="john@example.com" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">Password</label>
                        <input required name="password" id="password" type="password" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="••••••••" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                        <input required name="phone" id="phone" type="tel" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="+91 98765 43210" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="skills" className="text-sm font-medium">Skills (Comma separated)</label>
                        <input name="skills" id="skills" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Teaching, Driving, First Aid, Coding" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="availability" className="text-sm font-medium">Availability</label>
                        <select name="availability" id="availability" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option value="Weekends">Weekends Only</option>
                            <option value="Weekdays">Weekdays Only</option>
                            <option value="Flexible">Flexible / Any Time</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="motivation" className="text-sm font-medium">Why do you want to volunteer?</label>
                        <textarea name="motivation" id="motivation" className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Tell us a bit about yourself..." />
                    </div>

                    <div className="pt-2">
                        <Captcha onVerify={setCaptchaVerified} />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting || !captchaVerified}>
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
