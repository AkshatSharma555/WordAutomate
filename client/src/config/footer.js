import { Twitter, Linkedin, Github, Instagram } from "lucide-react";

export const footerLinks = [
    {
        title: "Product",
        links: [
            { name: "Features", href: "#features" },
            { name: "Pricing", href: "#pricing" },
            { name: "Testimonials", href: "#testimonials" },
        ],
    },
    {
        title: "Company",
        links: [
            { name: "About Us", href: "#about" },
            { name: "Careers", href: "#careers" },
            { name: "Contact", href: "#contact" },
        ],
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy Policy", href: "#privacy" },
            { name: "Terms of Service", href: "#terms" },
        ],
    },
];

export const socialLinks = [
    { icon: Twitter, href: "https://twitter.com" },
    { icon: Linkedin, href: "https://linkedin.com" },
    { icon: Github, href: "https://github.com" },
    { icon: Instagram, href: "https://instagram.com" },
];