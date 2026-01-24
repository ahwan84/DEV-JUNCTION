import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Heart, Target, Users } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 bg-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
                <div className="container relative z-10 text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        Driven by Compassion, <br />
                        <span className="text-primary-foreground">United for Change.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
                        We are a non-profit organization dedicated to bridging the gap between those who want to help and communities in need.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-white">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
                                <Target className="mr-2 h-4 w-4" /> Our Mission
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                                Connecting Resources to <br />
                                <span className="text-primary">Real Needs.</span>
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                To create a transparent, efficient, and accessible platform where volunteers and donors can connect with impactful grassroots initiatives. We believe in the power of community action to solve local challenges.
                            </p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                            <div className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700 mb-6">
                                <Heart className="mr-2 h-4 w-4" /> Our Vision
                            </div>
                            <h3 className="text-2xl font-bold mb-4">A World of Active Citizens</h3>
                            <p className="text-slate-600 mb-6">
                                A world where every individual has the opportunity and resources to contribute meaningfully to society, fostering a culture of empathy and active citizenship.
                            </p>
                            <ul className="space-y-3">
                                {['Transparency First', 'Community Led', 'Sustainable Impact'].map((item) => (
                                    <li key={item} className="flex items-center text-slate-700 font-medium">
                                        <div className="h-2 w-2 rounded-full bg-primary mr-3" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* History / Timeline */}
            <section className="py-20 bg-slate-50">
                <div className="container max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
                        <p className="text-slate-600">From a small group of friends to a movement.</p>
                    </div>

                    <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                        {[
                            { year: '2024', title: 'The Beginning', desc: 'Founded as a small group of volunteers organizing weekend clean-up drives.' },
                            { year: '2025', title: 'Scaling Up', desc: 'Launched the digital platform to connect donors and volunteers directly.' },
                            { year: '2026', title: 'Going Global', desc: 'Expanded operations to support education and healthcare initiatives across the region.' },
                        ].map((item, i) => (
                            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-hover:bg-primary group-hover:text-white transition-colors shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    <div className="w-3 h-3 bg-current rounded-full" />
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <span className="text-sm font-bold text-primary mb-1 block">{item.year}</span>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-slate-600">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-white text-center">
                <div className="container max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6">Join Our Journey</h2>
                    <p className="text-lg text-slate-600 mb-8">
                        Whether you want to volunteer your time or support us financially, your contribution matters.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/volunteer">
                            <Button size="lg" className="rounded-full px-8">Become a Volunteer</Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" variant="outline" className="rounded-full px-8">Contact Us</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
