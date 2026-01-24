import { ChatInterface } from "@/components/trust/ChatInterface";

export default function TrustPage() {
    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Transparency Hub
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        We believe in radical transparency. Use our AI-powered assistant to explore our data, verify our impact, and see exactly how your contributions are making a difference.
                    </p>
                </div>

                <ChatInterface />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-center">
                    <div className="p-6 rounded-lg bg-muted/50">
                        <h3 className="font-semibold mb-2">Real-time Data</h3>
                        <p className="text-sm text-muted-foreground">Access up-to-the-minute information about our operations.</p>
                    </div>
                    <div className="p-6 rounded-lg bg-muted/50">
                        <h3 className="font-semibold mb-2">Verified Impact</h3>
                        <p className="text-sm text-muted-foreground">Cross-referenced data ensuring every dollar is accounted for.</p>
                    </div>
                    <div className="p-6 rounded-lg bg-muted/50">
                        <h3 className="font-semibold mb-2">Open Access</h3>
                        <p className="text-sm text-muted-foreground">Available to all donors, volunteers, and the public.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
