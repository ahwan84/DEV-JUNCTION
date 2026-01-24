import Link from 'next/link';
import { Heart } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t bg-muted/40">
            <div className="container py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Heart className="h-5 w-5 text-red-500 fill-current" />
                            <span className="text-lg font-bold">HopeConnect</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Connecting hearts, changing lives. Join us in making a difference today.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">About</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary">Our Mission</Link></li>
                            <li><Link href="/compliance" className="hover:text-primary">Compliance</Link></li>
                            <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Get Involved</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/volunteer" className="hover:text-primary">Volunteer</Link></li>
                            <li><Link href="/donate" className="hover:text-primary">Donate</Link></li>
                            <li><Link href="/programs" className="hover:text-primary">Our Programs</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Connect</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Twitter</li>
                            <li>Facebook</li>
                            <li>Instagram</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} HopeConnect NGO. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
