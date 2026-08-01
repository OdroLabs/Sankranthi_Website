export const site = {
  name: "Sankranthi Foundation",
  tagline: "Rights • Health • Dignity",
  description:
    "A trans-led community organisation in Sri Lanka providing free health clinics, psychosocial support and advocacy for transgender women and sex worker communities.",
  hotline: "+94 77 011 0489",
  hotlineHref: "tel:+94770110489",
  whatsapp: "https://wa.me/94770110489",
  facebook: "https://www.facebook.com/ntnsrilanka/",
  location: "Colombo & Gampaha, Sri Lanka",
};

export const publicNav = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Publications", href: "/publications" },
  { label: "Volunteers", href: "/volunteers" },
  { label: "Nail SPA", href: "/spa" },
  { label: "Suggestions", href: "/suggestions" },
  { label: "Contact", href: "/contact" },
];

export const adminNav: { label: string; href: string; adminOnly?: boolean }[] = [
  { label: "Overview", href: "/dashboard" },
  { label: "Projects", href: "/dashboard/projects" },
  { label: "Services", href: "/dashboard/services" },
  { label: "Publications", href: "/dashboard/publications" },
  { label: "Events", href: "/dashboard/events" },
  { label: "News", href: "/dashboard/news" },
  { label: "Gallery", href: "/dashboard/gallery" },
  { label: "Volunteers", href: "/dashboard/volunteers" },
  { label: "SPA services", href: "/dashboard/spa-services" },
  { label: "SPA bookings", href: "/dashboard/bookings" },
  { label: "Donations", href: "/dashboard/donations", adminOnly: true },
  { label: "Messages", href: "/dashboard/messages" },
  { label: "Suggestions", href: "/dashboard/suggestions" },
];
