import { Button } from "@/components/ui/button";
import { storage } from "@/lib/storage";
import Link from "next/link";
import { ArrowRight, Calendar, Heart, Users, ChevronRight } from "lucide-react";

export default function Home() {
  const events = storage.getEvents().slice(0, 3);
  const announcements = storage.getAnnouncements().slice(0, 2);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/40 z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-50 animate-slow-zoom" />
        </div>

        <div className="container relative z-20 space-y-8 py-20 flex flex-col items-center text-center">
          <Link href="/donate" className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer">
            <span className="mr-2 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">NEW</span>
            <span className="text-slate-200">Winter Donation Drive is live!</span>
            <ChevronRight className="ml-1 h-4 w-4 text-slate-400" />
          </Link>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl leading-tight">
            Empowering Communities, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Transforming Lives.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
            Join HopeConnect to volunteer your skills, donate to meaningful causes, and see the transparent impact of your contributions in real-time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/donate">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                Donate Now <Heart className="ml-2 h-5 w-5 fill-current" />
              </Button>
            </Link>
            <Link href="/volunteer">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-14 rounded-full bg-white/5 border-white/20 text-white hover:bg-white hover:text-slate-900 backdrop-blur-sm transition-all">
                Become a Volunteer
              </Button>
            </Link>
          </div>

          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 mt-12">
            <div>
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-sm text-slate-400">Active Volunteers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">$50k+</p>
              <p className="text-sm text-slate-400">Funds Raised</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">120+</p>
              <p className="text-sm text-slate-400">Events Completed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">100%</p>
              <p className="text-sm text-slate-400">Transparency</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Upcoming Events</h2>
              <p className="text-lg text-slate-600 max-w-2xl">
                Join us on the ground and make a direct impact in your community.
              </p>
            </div>
            <Link href="/programs" className="hidden md:flex items-center text-primary font-medium hover:underline">
              View All Events <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                <div className="aspect-[4/3] w-full bg-slate-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute bottom-4 left-4 z-20 text-white">
                    <span className="inline-block px-2 py-1 rounded-md bg-white/20 backdrop-blur-md text-xs font-medium mb-2">
                      {event.location}
                    </span>
                    <div className="flex items-center text-sm font-medium">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-slate-600 line-clamp-2 mb-6 text-sm leading-relaxed">
                    {event.description}
                  </p>
                  <Link href={`/programs`}>
                    <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/programs">
              <Button variant="outline">View All Events</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Impact & Transparency */}
      <section className="py-24 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Transparency is our <br />
                <span className="text-primary">Core Value.</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                We believe that every donor deserves to know exactly where their money goes. That's why we publish real-time fund utilization reports and audit logs.
              </p>

              <div className="space-y-4">
                {[
                  { title: "Real-time Fund Tracking", desc: "See how every dollar is spent." },
                  { title: "Verified Impact Stories", desc: "Read stories from real beneficiaries." },
                  { title: "Open Audit Logs", desc: "Full visibility into admin actions." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Heart className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{item.title}</h3>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/impact">
                <Button size="lg" className="mt-4">View Impact Reports</Button>
              </Link>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-full blur-3xl opacity-50" />
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                <h3 className="text-xl font-bold mb-6">Fund Utilization</h3>
                <div className="space-y-6">
                  {[
                    { label: "Education Programs", val: 45, color: "bg-blue-500" },
                    { label: "Healthcare Initiatives", val: 30, color: "bg-emerald-500" },
                    { label: "Emergency Relief", val: 15, color: "bg-amber-500" },
                    { label: "Operations", val: 10, color: "bg-slate-300" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="flex justify-between text-sm font-medium mb-2">
                        <span>{stat.label}</span>
                        <span>{stat.val}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${stat.color} rounded-full`} style={{ width: `${stat.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="container relative z-10 mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Whether you have time to give or funds to share, your contribution changes lives. Join our community today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/volunteer">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full">
                Join as Volunteer
              </Button>
            </Link>
            <Link href="/donate">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full bg-transparent border-white text-white hover:bg-white hover:text-slate-900">
                Make a Donation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
