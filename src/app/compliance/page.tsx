import { FileText, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CompliancePage() {
    const documents = [
        { title: "Annual Report 2024", type: "PDF", size: "2.4 MB", date: "Jan 15, 2025" },
        { title: "Tax Exemption Certificate (80G)", type: "PDF", size: "1.1 MB", date: "Mar 10, 2024" },
        { title: "NGO Registration Certificate", type: "PDF", size: "0.8 MB", date: "Feb 22, 2024" },
        { title: "Audit Report FY 2023-24", type: "PDF", size: "3.5 MB", date: "Apr 05, 2024" },
    ];

    return (
        <div className="container py-12 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-green-100 rounded-full text-green-700">
                    <ShieldCheck className="h-8 w-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Compliance & Legal</h1>
                    <p className="text-muted-foreground">We are committed to full transparency and regulatory compliance.</p>
                </div>
            </div>

            <div className="grid gap-4">
                {documents.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-slate-100 rounded text-slate-500">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold">{doc.title}</h3>
                                <p className="text-xs text-muted-foreground">{doc.type} • {doc.size} • Uploaded {doc.date}</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">Download</Button>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-6 bg-slate-50 rounded-lg border">
                <h3 className="font-semibold mb-2">Registered Office</h3>
                <p className="text-sm text-muted-foreground">
                    HopeConnect Foundation<br />
                    123 Charity Lane, Social Sector Park<br />
                    New Delhi, 110001<br />
                    Registration No: NGO/2024/123456
                </p>
            </div>
        </div>
    );
}
