import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="container py-12">
            <h1 className="text-4xl font-bold mb-10 text-center">Get in Touch</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
                        <p className="text-muted-foreground">
                            Have questions or want to collaborate? Reach out to us using any of the following methods.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Visit Us</h4>
                                <p className="text-muted-foreground">123 Charity Lane, Social Sector Park<br />New Delhi, 110001</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Email Us</h4>
                                <p className="text-muted-foreground">hello@hopeconnect.org<br />support@hopeconnect.org</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                <Phone className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Call Us</h4>
                                <p className="text-muted-foreground">+91 98765 43210<br />+91 11 2345 6789</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-8 border rounded-xl shadow-sm">
                    <h3 className="text-xl font-bold mb-6">Send us a Message</h3>
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                                <input id="firstName" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="John" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                                <input id="lastName" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Doe" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <input id="email" type="email" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="john@example.com" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">Message</label>
                            <textarea id="message" className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="How can we help you?" />
                        </div>

                        <Button type="submit" className="w-full">Send Message</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
