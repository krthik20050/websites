"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  MessageSquare,
  Send,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="bg-[#050508] text-white min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-32 sm:px-6 sm:py-40 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/25 text-gold text-xs font-semibold uppercase tracking-[0.2em]">
            <Sparkles className="h-3.5 w-3.5" />
            Contact
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Get In{" "}
            <span className="font-cursive text-gold capitalize normal-case text-5xl sm:text-6xl tracking-normal inline-block">
              Touch
            </span>
          </h1>
          <p className="mt-4 text-base text-brand-300 max-w-md mx-auto leading-relaxed">
            Visit our shop in Thrissur or reach out online — we&apos;re happy to assist you with your project needs.
          </p>
        </div>

        {/* Two Column Grid */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Left Column: Info Cards & Map */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Shop Info Card */}
            <Card className="border-white/10 bg-card">
              <CardContent className="p-6">
                <h3 className="mb-5 text-sm font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                  <MapPin className="h-4.5 w-4.5 text-gold" />
                  <span>Shop Information</span>
                </h3>
                <div className="space-y-4 text-sm text-brand-300">
                  <p className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4.5 w-4.5 text-gold shrink-0" />
                    <span>CamRents, Round West, Thrissur, Kerala 680001</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <Phone className="h-4.5 w-4.5 text-gold shrink-0" />
                    <a href="tel:+919999999999" className="transition-colors hover:text-white font-medium">
                      +91 99999 99999
                    </a>
                  </p>
                  <p className="flex items-center gap-3">
                    <svg className="h-4.5 w-4.5 text-gold shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                      WhatsApp Us
                    </a>
                  </p>
                  <p className="flex items-center gap-3">
                    <Mail className="h-4.5 w-4.5 text-gold shrink-0" />
                    <a href="mailto:hello@camrents.in" className="transition-colors hover:text-white">
                      hello@camrents.in
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours Card */}
            <Card className="border-white/10 bg-card">
              <CardContent className="p-6">
                <h3 className="mb-5 text-sm font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                  <Clock className="h-4.5 w-4.5 text-gold" />
                  <span>Business Hours</span>
                </h3>
                <div className="space-y-3 text-sm text-brand-300">
                  <div className="flex justify-between">
                    <span>Monday – Saturday</span>
                    <span className="font-semibold text-white">9:00 AM – 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold text-white">10:00 AM – 6:00 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Google Map Wrapper */}
            <div className="bezel-outer overflow-hidden shadow-lg shadow-gold/5 transition-transform duration-500 hover:scale-[1.01]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125320.94515685!2d76.1551!3d10.5276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b08152f440aa82d%3A0xb4e21178b0a7d0a8!2sThrissur%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="CamRents location in Thrissur"
                className="bezel-inner"
              />
            </div>

          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <Card className="border-white/10 bg-card h-full">
              <CardContent className="p-8">
                <h3 className="mb-6 text-base font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-4">
                  <MessageSquare className="h-5 w-5 text-gold" />
                  <span>Send Us a Message</span>
                </h3>
                
                {sent ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-md">
                      <Check className="h-8 w-8" />
                    </div>
                    <h4 className="text-xl font-bold text-white">Message Sent Successfully!</h4>
                    <p className="text-sm text-brand-300 max-w-xs mx-auto leading-relaxed">
                      Thank you for reaching out. A team member will get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSent(true);
                    }}
                    className="space-y-6"
                  >
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2 text-left">
                        <label className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">Your Name</label>
                        <Input
                          placeholder="Rajesh Kumar"
                          required
                          className="rounded-xl border-white/10 bg-[#0c0c10] text-white placeholder:text-brand-500 focus-visible:ring-gold"
                        />
                      </div>
                      <div className="space-y-2 text-left">
                        <label className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">Phone Number</label>
                        <Input
                          placeholder="99999 99999"
                          required
                          className="rounded-xl border-white/10 bg-[#0c0c10] text-white placeholder:text-brand-500 focus-visible:ring-gold"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">Email Address (Optional)</label>
                      <Input
                        placeholder="rajesh@example.com"
                        type="email"
                        className="rounded-xl border-white/10 bg-[#0c0c10] text-white placeholder:text-brand-500 focus-visible:ring-gold"
                      />
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">Your Message</label>
                      <textarea
                        placeholder="What gear do you need for your shoot?"
                        required
                        rows={5}
                        className="w-full rounded-xl border border-white/10 bg-[#0c0c10] px-3.5 py-3 text-sm text-white placeholder:text-brand-500 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/25 transition-all duration-300"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gold hover:bg-gold-hover text-black font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-gold/15"
                    >
                      <Send className="h-4 w-4" />
                      <span>Send Message</span>
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
