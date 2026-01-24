import { storage } from "@/lib/storage";
import { CheckCircle, DollarSign, TrendingUp, ShieldCheck, Users, Heart } from "lucide-react";

export default function ImpactPage() {
    const donations = storage.getDonations();
    const totalRaised = donations.reduce((acc, curr) => acc + curr.amount, 0);
    const utilization = [
        { category: "Education Programs", amount: 15000, percent: 30, color: "bg-blue-500" },
        { category: "Food Distribution", amount: 10000, percent: 20, color: "bg-emerald-500" },
        { category: "Healthcare Camps", amount: 12500, percent: 25, color: "bg-purple-500" },
        { category: "Admin & Operations", amount: 5000, percent: 10, color: "bg-slate-400" },
        { category: "Reserves", amount: 7500, percent: 15, color: "bg-amber-500" },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-slate-900 text-white py-20">
                <div className="container text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Transparency in Action</h1>
                    <p className="text-xl text-slate-300">
                        We believe in radical transparency. Every dollar you donate is tracked, accounted for, and used to create maximum impact.
                    </p>
                </div>
            </div>

            <div className="container -mt-10 relative z-10 mx-auto">
                {/* Key Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="p-8 bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center text-center">
                        <div className="p-4 bg-blue-50 rounded-full text-blue-600 mb-4">
                            <DollarSign className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-600 mb-1">Total Funds Raised</h3>
                        <p className="text-4xl font-bold text-slate-900">${totalRaised.toLocaleString()}</p>
                        <p className="text-sm text-slate-500 mt-2">Across all campaigns</p>
                    </div>

                    <div className="p-8 bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center text-center">
                        <div className="p-4 bg-emerald-50 rounded-full text-emerald-600 mb-4">
                            <CheckCircle className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-600 mb-1">Projects Completed</h3>
                        <p className="text-4xl font-bold text-slate-900">24</p>
                        <p className="text-sm text-slate-500 mt-2">Last 12 months</p>
                    </div>

                    <div className="p-8 bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center text-center">
                        <div className="p-4 bg-purple-50 rounded-full text-purple-600 mb-4">
                            <TrendingUp className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-600 mb-1">Lives Impacted</h3>
                        <p className="text-4xl font-bold text-slate-900">1,250+</p>
                        <p className="text-sm text-slate-500 mt-2">Direct beneficiaries</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {/* Fund Utilization */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">Fund Utilization Report</h2>
                            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                FY 2024-25
                            </span>
                        </div>

                        <div className="space-y-8">
                            {utilization.map((item) => (
                                <div key={item.category}>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium text-slate-700">{item.category}</span>
                                        <span className="font-bold text-slate-900">${item.amount.toLocaleString()} <span className="text-slate-400 font-normal text-sm">({item.percent}%)</span></span>
                                    </div>
                                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                                            style={{ width: `${item.percent}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t flex items-center gap-2 text-sm text-slate-500">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            Audited by independent third-party auditors. Last update: {new Date().toLocaleDateString()}
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                            <h3 className="font-bold text-lg mb-4">Why Trust Us?</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <div className="mt-1 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                                        <CheckCircle className="h-3 w-3" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">Registered NGO</p>
                                        <p className="text-sm text-slate-500">Reg No: NGO/2024/123456</p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="mt-1 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                                        <CheckCircle className="h-3 w-3" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">Tax Benefits</p>
                                        <p className="text-sm text-slate-500">80G Certified for tax exemptions</p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="mt-1 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                                        <CheckCircle className="h-3 w-3" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">100% Secure</p>
                                        <p className="text-sm text-slate-500">SSL Encrypted payments</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-primary/5 rounded-2xl border border-primary/10 p-8 text-center">
                            <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
                            <h3 className="font-bold text-lg mb-2">Make an Impact</h3>
                            <p className="text-sm text-slate-600 mb-4">
                                Your contribution directly supports these initiatives.
                            </p>
                            <button className="w-full py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
                                Donate Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recent Donations Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b bg-slate-50/50">
                        <h2 className="text-xl font-bold text-slate-900">Recent Donations</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Donor</th>
                                    <th className="px-6 py-4 font-medium">Amount</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {donations.slice(0, 5).map((donation) => (
                                    <tr key={donation.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{donation.donorName}</td>
                                        <td className="px-6 py-4 text-emerald-600 font-bold">${donation.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-slate-500">{new Date(donation.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Verified
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
