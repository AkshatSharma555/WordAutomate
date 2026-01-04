import React from 'react';
import SectionTitle from '../components/common/SectionTitle';
import Button from '../components/common/Button';
import { cn } from '../utils/cn';
import { Linkedin, Github, Youtube, Send, MessageSquare, User, AtSign, Bug, Lightbulb, ExternalLink } from 'lucide-react';

const Contact = ({ isDark }) => {

  return (
    <section 
        id="contact" 
        className={cn(
            "py-24 px-6 relative transition-colors duration-500",
            isDark ? "bg-transparent" : "bg-white"
        )}
    >
        <div className="max-w-6xl mx-auto">
            
            <SectionTitle 
                isDark={isDark}
                subtitle="Support"
                title="We're here to help"
                description="Found a bug? Have a feature suggestion? Or just want to say hi?"
            />

            {/* MAIN LAYOUT: Aligned to start to prevent stretching gaps */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-12 items-start">
                
                {/* --- LEFT: SOCIAL CARDS --- */}
                <div className="lg:col-span-5 flex flex-col gap-4 w-full">
                    
                    {/* Top Row: LinkedIn (Wide) */}
                    <a 
                        href="https://www.linkedin.com/in/akshat-sharma-6664422b3" 
                        target="_blank" 
                        rel="noreferrer"
                        className={cn(
                            "group relative p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between overflow-hidden",
                            isDark 
                                ? "bg-slate-900/60 border-white/10 hover:border-[#0077b5]/50" 
                                : "bg-white border-slate-200 shadow-sm hover:border-[#0077b5]/50 hover:shadow-md"
                        )}
                    >
                        <div className="flex items-center gap-4 relative z-10">
                            <div className={cn("p-2.5 rounded-xl transition-colors", isDark ? "bg-[#0077b5]/20 text-[#0077b5]" : "bg-[#0077b5]/10 text-[#0077b5]")}>
                                <Linkedin size={24} />
                            </div>
                            <div>
                                <h3 className={cn("text-base font-bold", isDark ? "text-white" : "text-slate-900")}>LinkedIn</h3>
                                <p className={cn("text-xs font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Connect Professionally</p>
                            </div>
                        </div>
                        <ExternalLink size={18} className={cn("opacity-0 group-hover:opacity-100 transition-opacity", isDark ? "text-slate-400" : "text-slate-500")} />
                        
                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0077b5]/0 via-[#0077b5]/5 to-[#0077b5]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </a>

                    {/* Middle Row: GitHub & YouTube (Side by Side) */}
                    <div className="grid grid-cols-2 gap-4">
                        <a 
                            href="https://github.com/AkshatSharma555"
                            target="_blank"
                            rel="noreferrer"
                            className={cn(
                                "group p-5 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center text-center gap-2",
                                isDark 
                                    ? "bg-slate-900/60 border-white/10 hover:border-white/40" 
                                    : "bg-white border-slate-200 shadow-sm hover:border-slate-400 hover:shadow-md"
                            )}
                        >
                            <div className={cn("p-2.5 rounded-xl", isDark ? "bg-white/10 text-white" : "bg-slate-100 text-slate-900")}>
                                <Github size={24} />
                            </div>
                            <span className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>GitHub</span>
                        </a>

                        <a 
                            href="https://www.youtube.com/@Akshat_sharma."
                            target="_blank"
                            rel="noreferrer"
                            className={cn(
                                "group p-5 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center text-center gap-2",
                                isDark 
                                    ? "bg-slate-900/60 border-white/10 hover:border-[#FF0000]/50" 
                                    : "bg-white border-slate-200 shadow-sm hover:border-[#FF0000]/50 hover:shadow-md"
                            )}
                        >
                            <div className={cn("p-2.5 rounded-xl", isDark ? "bg-[#FF0000]/20 text-[#FF0000]" : "bg-[#FF0000]/10 text-[#FF0000]")}>
                                <Youtube size={24} />
                            </div>
                            <span className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>YouTube</span>
                        </a>
                    </div>

                    {/* Bottom Row: Urgent Help Box (NO GAP NOW) */}
                    {/* 'mt-auto' hataya taaki ye chipak ke aaye */}
                    <div className={cn(
                        "p-5 rounded-2xl border text-center transition-colors",
                        isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
                    )}>
                        <p className={cn("text-sm font-bold mb-1", isDark ? "text-slate-200" : "text-slate-700")}>
                            Need urgent help? 🚨
                        </p>
                        <p className={cn("text-xs leading-relaxed", isDark ? "text-slate-400" : "text-slate-500")}>
                            DM on LinkedIn for fastest response. <br/> We know submissions are stressful!
                        </p>
                    </div>

                </div>

                {/* --- RIGHT: FORM --- */}
                <div className={cn(
                    "lg:col-span-7 w-full p-6 md:p-8 rounded-3xl border transition-all duration-300",
                    isDark 
                        ? "bg-slate-900/60 border-white/10 backdrop-blur-md" 
                        : "bg-white border-slate-200 shadow-xl shadow-orange-500/5"
                )}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className={cn(
                            "p-2.5 rounded-xl",
                            isDark ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                        )}>
                            <MessageSquare size={20} />
                        </div>
                        <div>
                            <h3 className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>
                                Send a Message
                            </h3>
                            <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                                We usually reply within 24 hours.
                            </p>
                        </div>
                    </div>

                    <form 
                        action="https://formsubmit.co/s.akshat340@gmail.com" 
                        method="POST"
                        className="space-y-4"
                    >
                        <input type="hidden" name="_captcha" value="false" />
                        <input type="hidden" name="_subject" value="Support Request - WordAutomate" />

                        {/* Name & Email Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className={cn("text-xs font-medium ml-1 flex items-center gap-1.5", isDark ? "text-slate-400" : "text-slate-600")}>
                                    <User size={12} /> Name
                                </label>
                                <input 
                                    type="text" 
                                    name="name"
                                    required
                                    placeholder="Your Name"
                                    className={cn(
                                        "w-full px-4 py-2.5 rounded-xl border outline-none transition-all text-sm",
                                        isDark 
                                            ? "bg-slate-950/50 border-white/10 focus:border-primary text-white placeholder:text-slate-600" 
                                            : "bg-white border-slate-200 focus:border-secondary text-slate-900 placeholder:text-slate-400"
                                    )}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className={cn("text-xs font-medium ml-1 flex items-center gap-1.5", isDark ? "text-slate-400" : "text-slate-600")}>
                                    <AtSign size={12} /> Email
                                </label>
                                <input 
                                    type="email" 
                                    name="email"
                                    required
                                    placeholder="your@email.com"
                                    className={cn(
                                        "w-full px-4 py-2.5 rounded-xl border outline-none transition-all text-sm",
                                        isDark 
                                            ? "bg-slate-950/50 border-white/10 focus:border-primary text-white placeholder:text-slate-600" 
                                            : "bg-white border-slate-200 focus:border-secondary text-slate-900 placeholder:text-slate-400"
                                    )}
                                />
                            </div>
                        </div>

                        {/* Category Selection */}
                        <div className="space-y-1.5">
                            <label className={cn("text-xs font-medium ml-1", isDark ? "text-slate-400" : "text-slate-600")}>
                                Topic
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {['Bug', 'Idea', 'Other'].map((opt) => (
                                    <label key={opt} className={cn(
                                        "cursor-pointer text-center py-2.5 rounded-xl border text-xs font-bold transition-all hover:border-primary/50",
                                        isDark ? "bg-slate-950/30 border-white/10 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"
                                    )}>
                                        <input type="radio" name="subject_type" value={opt} className="hidden peer" />
                                        <span className="peer-checked:text-primary flex items-center justify-center gap-1">
                                            {opt === 'Bug' && <Bug size={12}/>}
                                            {opt === 'Idea' && <Lightbulb size={12}/>}
                                            {opt}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Message Box */}
                        <div className="space-y-1.5">
                            <label className={cn("text-xs font-medium ml-1", isDark ? "text-slate-400" : "text-slate-600")}>Message</label>
                            <textarea 
                                name="message"
                                required
                                rows="3"
                                placeholder="Type your message here..."
                                className={cn(
                                    "w-full px-4 py-3 rounded-xl border outline-none transition-all resize-none text-sm",
                                    isDark 
                                        ? "bg-slate-950/50 border-white/10 focus:border-primary text-white placeholder:text-slate-600" 
                                        : "bg-white border-slate-200 focus:border-secondary text-slate-900 placeholder:text-slate-400"
                                )}
                            ></textarea>
                        </div>

                        <Button type="submit" className="w-full h-12 text-sm font-bold shadow-lg shadow-primary/25 rounded-xl mt-2">
                            Send Message <Send size={16} className="ml-2" />
                        </Button>
                    </form>
                </div>

            </div>
        </div>
    </section>
  );
};

export default Contact;