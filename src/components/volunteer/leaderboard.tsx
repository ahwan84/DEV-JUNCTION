import { storage } from "@/lib/storage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Star } from "lucide-react";

export async function Leaderboard() {
    const allVolunteers = await storage.getVolunteers();

    // Filter approved and sort by points
    const topVolunteers = allVolunteers
        .filter(v => v.status === 'APPROVED')
        .sort((a, b) => (b.points || 0) - (a.points || 0))
        .slice(0, 5);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50">
                <h2 className="text-xl font-bold flex items-center gap-2 text-amber-900">
                    <Trophy className="w-5 h-5 text-amber-600" />
                    Community Champions
                </h2>
                <p className="text-sm text-amber-700/80 mt-1">Top contributors making a difference</p>
            </div>

            <div className="divide-y divide-slate-50">
                {topVolunteers.map((volunteer, index) => (
                    <div key={volunteer.id} className="flex items-center p-4 hover:bg-slate-50 transition-colors">
                        <div className="w-8 font-bold text-slate-400 text-center mr-2">
                            {index === 0 && <Medal className="w-6 h-6 text-yellow-500 mx-auto" />}
                            {index === 1 && <Medal className="w-6 h-6 text-slate-400 mx-auto" />}
                            {index === 2 && <Medal className="w-6 h-6 text-amber-600 mx-auto" />}
                            {index > 2 && <span className="text-lg">#{index + 1}</span>}
                        </div>

                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                            <AvatarImage src={volunteer.avatarUrl} alt={volunteer.name} />
                            <AvatarFallback>{volunteer.name.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div className="ml-4 flex-1">
                            <p className="font-semibold text-slate-900">{volunteer.name}</p>
                            <p className="text-xs text-slate-500">{volunteer.registeredEvents?.length || 0} events attended</p>
                        </div>

                        <div className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full text-amber-800 font-bold text-sm">
                            <Star className="w-3.5 h-3.5 fill-amber-800" />
                            {volunteer.points || 0}
                        </div>
                    </div>
                ))}

                {topVolunteers.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        No champions yet. Start volunteering to earn points!
                    </div>
                )}
            </div>
        </div>
    );
}
