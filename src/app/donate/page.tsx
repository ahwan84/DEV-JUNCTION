'use client';

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { CheckCircle, Download, Heart } from "lucide-react";

export default function DonatePage() {
    const [step, setStep] = useState<'amount' | 'details' | 'payment' | 'receipt'>('amount');
    const [amount, setAmount] = useState<number>(1000);
    const [customAmount, setCustomAmount] = useState<string>('');
    const [details, setDetails] = useState({ name: '', email: '', pan: '' });

    const handleAmountSelect = (val: number) => {
        setAmount(val);
        setCustomAmount('');
    };

    const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomAmount(e.target.value);
        setAmount(Number(e.target.value));
    };

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('payment');
    };

    const handlePayment = () => {
        // Mock payment processing
        setTimeout(() => {
            setStep('receipt');
        }, 1500);
    };

    if (step === 'receipt') {
        return (
            <div className="container py-20 max-w-2xl mx-auto text-center">
                <div className="mb-6 flex justify-center">
                    <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <CheckCircle className="h-10 w-10" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold mb-4">Thank You, {details.name}!</h1>
                <p className="text-muted-foreground mb-8">
                    Your donation of ₹{amount} has been successfully received. A confirmation email has been sent to {details.email}.
                </p>

                <div className="bg-white border rounded-xl p-8 shadow-sm text-left mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-primary">HopeConnect</h2>
                            <p className="text-sm text-muted-foreground">Donation Receipt</p>
                        </div>
                        <div className="text-right">
                            <p className="font-mono text-sm text-muted-foreground">#RCPT-{Math.floor(Math.random() * 10000)}</p>
                            <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Donor Name</span>
                            <span className="font-medium">{details.name}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Amount</span>
                            <span className="font-medium">₹{amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Payment Method</span>
                            <span className="font-medium">UPI / Card</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Status</span>
                            <span className="font-medium text-green-600">Success</span>
                        </div>
                    </div>

                    <div className="text-center text-xs text-muted-foreground">
                        This is a computer generated receipt and does not require a signature.<br />
                        Registered NGO under Section 8. Tax Exemption Certificate: 80G/1234/5678.
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={() => window.print()}>
                        <Download className="mr-2 h-4 w-4" /> Download Receipt
                    </Button>
                    <Button onClick={() => setStep('amount')}>Donate Again</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 max-w-xl">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold mb-4">Make a Donation</h1>
                <p className="text-muted-foreground">Your contribution helps us reach more communities.</p>
            </div>

            <div className="bg-white border rounded-xl p-6 md:p-8 shadow-sm">
                {step === 'amount' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[500, 1000, 2500, 5000, 10000].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => handleAmountSelect(val)}
                                    className={`relative py-4 px-4 rounded-xl border-2 font-bold text-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${amount === val && !customAmount
                                        ? 'border-primary bg-primary text-white shadow-lg shadow-primary/25'
                                        : 'border-slate-100 bg-white text-slate-700 hover:border-primary/50 hover:shadow-md'
                                        }`}
                                >
                                    ₹{val.toLocaleString()}
                                    {val === 1000 && (
                                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                                            POPULAR
                                        </span>
                                    )}
                                </button>
                            ))}
                            <div className="relative col-span-1">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                                <input
                                    type="number"
                                    placeholder="Custom"
                                    value={customAmount}
                                    onChange={handleCustomAmount}
                                    className={`w-full h-full py-4 pl-8 pr-4 rounded-xl border-2 font-bold text-lg transition-all focus:outline-none focus:ring-4 focus:ring-primary/10 ${customAmount
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-slate-100 bg-slate-50 text-slate-900 hover:border-slate-200'
                                        }`}
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                className="w-full text-lg h-14 rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
                                onClick={() => setStep('details')}
                            >
                                Continue with ₹{amount.toLocaleString()} <Heart className="ml-2 h-5 w-5 fill-current animate-pulse" />
                            </Button>
                            <p className="text-center text-xs text-muted-foreground mt-4">
                                Section 80G tax exemption certificate available upon request.
                            </p>
                        </div>
                    </div>
                )}

                {step === 'details' && (
                    <form onSubmit={handleDetailsSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <input
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={details.name}
                                onChange={(e) => setDetails({ ...details, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <input
                                required
                                type="email"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={details.email}
                                onChange={(e) => setDetails({ ...details, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">PAN Card (for tax exemption)</label>
                            <input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder="Optional"
                                value={details.pan}
                                onChange={(e) => setDetails({ ...details, pan: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-4 pt-4">
                            <Button type="button" variant="outline" className="flex-1" onClick={() => setStep('amount')}>Back</Button>
                            <Button type="submit" className="flex-1">Proceed to Pay</Button>
                        </div>
                    </form>
                )}

                {step === 'payment' && (
                    <PaymentProcessing onComplete={handlePayment} amount={amount} userDetails={details} />
                )}
            </div>
        </div>
    );
}

import { UPIQR } from "@/components/ui/upi-qr";
import { createRazorpayOrder, sendThankYouEmail } from "@/app/actions";
import Script from "next/script";

function PaymentProcessing({ onComplete, amount, userDetails }: { onComplete: () => void, amount: number, userDetails: any }) {
    const [loading, setLoading] = useState(false);

    const handleRazorpayPayment = async () => {
        setLoading(true);
        try {
            // 1. Create Order
            const order = await createRazorpayOrder(amount);
            if (!order.success) {
                alert("Failed to initialize payment. Please try again.");
                setLoading(false);
                return;
            }

            // Handle Mock Mode (If no valid keys provided)
            if ((order as any).isMock) {
                console.log("Mock Payment Mode Active");
                setTimeout(async () => {
                    alert("Mock Payment Successful! (Update .env for real payments)");
                    await sendThankYouEmail(userDetails.email, userDetails.name, amount);
                    onComplete();
                }, 1500);
                return;
            }

            // 2. Open Razorpay Modal (Real Mode)
            const options = {
                key: order.key,
                amount: order.amount,
                currency: order.currency,
                name: "HopeConnect",
                description: "Donation",
                order_id: order.orderId,
                handler: async function (response: any) {
                    console.log("Payment Successful", response);
                    // 3. Send Email on Success
                    await sendThankYouEmail(userDetails.email, userDetails.name, amount);
                    onComplete();
                },
                prefill: {
                    name: userDetails.name,
                    email: userDetails.email,
                    contact: userDetails.phone || ""
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const rzp = new (window as any).Razorpay(options);

            rzp.on('payment.failed', function (response: any) {
                alert("Payment Failed: " + response.error.description);
            });

            rzp.open();

        } catch (error) {
            console.error(error);
            alert("Payment failed. Please try again.");
        } finally {
            if (!loading) setLoading(false);
            // Note: In real mode, we might want to keep loading until modal closes or succeeds
        }
    };

    const handleUPIComplete = async () => {
        // For UPI Manual check, we just send the email assuming they paid
        await sendThankYouEmail(userDetails.email, userDetails.name, amount);
        onComplete();
    };

    return (
        <div className="space-y-8 py-4">
            {/* Load Razorpay SDK */}
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />

            <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Choose Payment Method</h3>
                <p className="text-sm text-muted-foreground">Secure payment gateways</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Option 1: Razorpay */}
                <div className="border rounded-xl p-6 hover:shadow-md transition-all cursor-pointer bg-slate-50 flex flex-col items-center justify-center space-y-4" onClick={handleRazorpayPayment}>
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        ₹
                    </div>
                    <div className="text-center">
                        <h4 className="font-semibold text-slate-900">Pay Online</h4>
                        <p className="text-xs text-slate-500">Cards, Netbanking, Wallet</p>
                    </div>
                    <Button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                        {loading ? 'Processing...' : 'Pay with Razorpay'}
                    </Button>
                </div>

                {/* Option 2: Direct UPI */}
                <div className="border rounded-xl p-6 bg-white space-y-4">
                    <div className="text-center">
                        <h4 className="font-semibold text-slate-900 mb-2">Scan UPI QR</h4>
                        <div className="flex justify-center">
                            <UPIQR amount={amount} />
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleUPIComplete}
                        className="w-full border-green-600 text-green-600 hover:bg-green-50"
                    >
                        I have scanned & paid
                    </Button>
                </div>
            </div>
        </div>
    );
}
