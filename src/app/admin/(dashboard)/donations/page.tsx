import { storage } from "@/lib/storage";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DonationsPage() {
    const donations = storage.getDonations();
    const totalRaised = donations.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Donations & Funds</h1>
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Funds Raised</p>
                    <p className="text-2xl font-bold text-green-600">${totalRaised.toLocaleString()}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 border-b flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                            placeholder="Search donors..."
                        />
                    </div>
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                </div>

                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-muted-foreground border-b">
                        <tr>
                            <th className="px-6 py-4 font-medium">Receipt ID</th>
                            <th className="px-6 py-4 font-medium">Donor</th>
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium">Amount</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {donations.map((donation) => (
                            <tr key={donation.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 font-mono text-xs">{donation.receiptId}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium">{donation.donorName}</span>
                                        <span className="text-xs text-muted-foreground">{donation.donorEmail}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{new Date(donation.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 font-medium text-green-600">${donation.amount.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="ghost" size="sm">View Receipt</Button>
                                </td>
                            </tr>
                        ))}
                        {donations.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                    No donations recorded yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
