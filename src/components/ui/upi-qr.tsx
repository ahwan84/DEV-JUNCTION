'use client';

import QRCode from "react-qr-code";

interface UPIQRProps {
    amount: number;
    upiId?: string;
    payeeName?: string;
}

export function UPIQR({ amount, upiId, payeeName }: UPIQRProps) {
    // Defaults if env not set
    const vpa = upiId || process.env.NEXT_PUBLIC_UPI_ID || 'demo@upi';
    const name = payeeName || process.env.NEXT_PUBLIC_PAYEE_NAME || 'HopeConnect';

    // Construct UPI URL
    // &am=amount (decimal)
    // &pn=payee name
    // &tr=transaction ref (optional)
    // &cu=INR
    const upiUrl = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;

    return (
        <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-xl shadow-sm border">
            <div className="bg-white p-4 rounded-lg border-2 border-slate-100">
                <div style={{ height: "auto", margin: "0 auto", maxWidth: 200, width: "100%" }}>
                    <QRCode
                        size={256}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={upiUrl}
                        viewBox={`0 0 256 256`}
                    />
                </div>
            </div>
            <div className="text-center space-y-1">
                <p className="font-medium text-slate-900">Scan to Pay using any UPI App</p>
                <p className="text-sm text-slate-500">Google Pay, PhonePe, Paytm, BHIM</p>
                <div className="mt-2 text-xs font-mono bg-slate-100 px-2 py-1 rounded inline-block">
                    Paying: ₹{amount} to {vpa}
                </div>
            </div>
        </div>
    );
}
