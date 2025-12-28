import React from 'react';
import SectionTitle from '../components/common/SectionTitle';
import Button from '../components/common/Button';
import MagicBento from '../components/ui/MagicBento';
import { cn } from '../utils/cn';
import { Mail, Instagram, Linkedin, Github, Youtube, Phone, Send, MessageSquare, User, AtSign, FileText } from 'lucide-react';

const Contact = ({ isDark }) => {

  // 🌟 Correct Social Data
  const socialLinks = [
    {
      title: 'LinkedIn',
      description: 'Professional Network',
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/akshat-sharma-6664422b3'
    },
    {
      title: 'GitHub',
      description: 'Code Portfolio',
      icon: Github,
      href: 'https://github.com/AkshatSharma555'
    },
    {
      title: 'Instagram',
      description: 'Personal Updates',
      icon: Instagram,
      href: 'https://www.instagram.com/akshat_518s/'
    },
    {
      title: 'YouTube',
      description: 'Tech Content',
      icon: Youtube,
      href: 'https://www.youtube.com/@Akshat_sharma.'
    },
    {
      title: 'WhatsApp',
      description: '+91 8766415768',
      icon: Phone,
      href: 'https://wa.me/918766415768'
    },
    {
      title: 'Email',
      description: 's.akshat340@gmail.com',
      icon: Mail,
      href: 'mailto:s.akshat340@gmail.com'
    }
  ];

  return (
    <section 
        id="contact" 
        className={cn(
            "py-24 px-6 relative transition-colors duration-500",
            isDark ? "bg-transparent" : "bg-white"
        )}
    >
        <div className="max-w-7xl mx-auto">
            
            <SectionTitle 
                isDark={isDark}
                subtitle="Contact"
                title="Get in Touch"
                description="Have a question or proposal? Connect with me directly."
            />

            <div className="flex flex-col lg:flex-row gap-12 mt-12">
                
                {/* --- LEFT: MAGIC BENTO (Socials) --- */}
                <div className="lg:w-1/2 min-h-[500px]">
                    <MagicBento 
                        items={socialLinks}
                        isDark={isDark}
                        // Teal for Dark, Orange for Light
                        glowColor={isDark ? "26, 163, 163" : "245, 74, 0"} 
                        enableStars={true}
                        enableTilt={true}
                        enableBorderGlow={true}
                    />
                </div>

                {/* --- RIGHT: PROFESSIONAL FORM --- */}
                <div className={cn(
                    "lg:w-1/2 p-8 rounded-3xl border transition-all duration-300",
                    isDark 
                        ? "bg-slate-900/60 border-white/10 backdrop-blur-md" 
                        : "bg-cream border-slate-200 shadow-xl shadow-orange-500/5"
                )}>
                    <div className="flex items-center gap-3 mb-8">
                        <div className={cn(
                            "p-3 rounded-xl",
                            isDark ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                        )}>
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <h3 className={cn("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                                Send a Message
                            </h3>
                            <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                                We will get back to you within 24 hours.
                            </p>
                        </div>
                    </div>

                    {/* FORM START */}
                    {/* Action="https://formsubmit.co/..." yeh magic trick hai jo email bhejegi */}
                    <form 
                        action="https://formsubmit.co/s.akshat340@gmail.com" 
                        method="POST"
                        className="space-y-6"
                    >
                        {/* Hidden Settings for FormSubmit */}
                        <input type="hidden" name="_captcha" value="false" />
                        <input type="hidden" name="_subject" value="New Submission from WordAutomate!" />
                        <input type="hidden" name="_template" value="table" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className={cn("text-sm font-medium ml-1 flex items-center gap-2", isDark ? "text-slate-300" : "text-slate-700")}>
                                    <User size={14} /> Name
                                </label>
                                <input 
                                    type="text" 
                                    name="name"
                                    required
                                    placeholder="Your Name"
                                    className={cn(
                                        "w-full px-4 py-3 rounded-xl border outline-none transition-all",
                                        isDark 
                                            ? "bg-slate-950/50 border-white/10 focus:border-primary text-white placeholder:text-slate-600" 
                                            : "bg-white border-slate-200 focus:border-secondary text-slate-900 placeholder:text-slate-400"
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className={cn("text-sm font-medium ml-1 flex items-center gap-2", isDark ? "text-slate-300" : "text-slate-700")}>
                                    <AtSign size={14} /> Email
                                </label>
                                <input 
                                    type="email" 
                                    name="email"
                                    required
                                    placeholder="you@example.com"
                                    className={cn(
                                        "w-full px-4 py-3 rounded-xl border outline-none transition-all",
                                        isDark 
                                            ? "bg-slate-950/50 border-white/10 focus:border-primary text-white placeholder:text-slate-600" 
                                            : "bg-white border-slate-200 focus:border-secondary text-slate-900 placeholder:text-slate-400"
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className={cn("text-sm font-medium ml-1 flex items-center gap-2", isDark ? "text-slate-300" : "text-slate-700")}>
                                <FileText size={14} /> Subject
                            </label>
                            <select 
                                name="subject_type"
                                className={cn(
                                "w-full px-4 py-3 rounded-xl border outline-none transition-all appearance-none cursor-pointer",
                                isDark 
                                    ? "bg-slate-950/50 border-white/10 focus:border-primary text-white" 
                                    : "bg-white border-slate-200 focus:border-secondary text-slate-900"
                            )}>
                                <option>General Inquiry</option>
                                <option>Bug Report</option>
                                <option>Feature Request</option>
                                <option>Collaboration</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className={cn("text-sm font-medium ml-1", isDark ? "text-slate-300" : "text-slate-700")}>Message</label>
                            <textarea 
                                name="message"
                                required
                                rows="4"
                                placeholder="How can we help you?"
                                className={cn(
                                    "w-full px-4 py-3 rounded-xl border outline-none transition-all resize-none",
                                    isDark 
                                        ? "bg-slate-950/50 border-white/10 focus:border-primary text-white placeholder:text-slate-600" 
                                        : "bg-white border-slate-200 focus:border-secondary text-slate-900 placeholder:text-slate-400"
                                )}
                            ></textarea>
                        </div>

                        <Button type="submit" className="w-full h-12 text-base shadow-lg shadow-primary/25">
                            Send Message <Send size={18} className="ml-2" />
                        </Button>
                    </form>
                </div>

            </div>
        </div>
    </section>
  );
};

export default Contact;