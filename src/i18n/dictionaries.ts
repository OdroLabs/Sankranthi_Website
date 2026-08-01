import type { Locale } from "@/i18n/config";

// English is the source of truth for the shape of every dictionary.
const en = {
  topbar: {
    hotline: "Community Hotline",
    safeSpaces: "Safe Spaces Available",
    contactUs: "Contact Us",
    chatNow: "Chat Now",
  },
  nav: {
    about: "About",
    services: "Services",
    projects: "Projects",
    publications: "Publications",
    news: "News",
    spa: "Nail SPA",
    contact: "Contact",
    events: "Events",
    gallery: "Gallery",
    volunteers: "Volunteers",
    suggestions: "Suggestions",
    donate: "Donate",
    getHelp: "Get Help Now",
  },
  btn: {
    ourServices: "Our Services",
    supportUs: "Support Us",
    readMore: "Read more",
    learnMore: "Learn more",
    reachOut: "Reach Out to Us",
    findSupport: "Find Support",
    getInTouch: "Get in touch",
    donateNow: "Donate now",
    followFacebook: "Follow us on Facebook",
    subscribe: "Subscribe",
    callToRegister: "Call to Register",
    collaborate: "Collaborate",
  },
  hero: {
    title: "Trans-led care for transgender women & sex worker communities in Sri Lanka",
    latestUpdate: "Latest Update:",
    featured: "Mobile Health Clinic — free screenings for trans women in Colombo & Gampaha",
  },
  services: {
    eyebrow: "Community Health & Support",
    title: "Our Services for Trans Women & Sex Workers",
    intro:
      "Free, confidential and judgement-free health care, psychosocial support and legal advocacy for the LGBTQIA+ and trans female sex worker community.",
  },
  community: {
    eyebrow: "What we do for the",
    title: "Community",
    clinics: "Trans Health Clinics",
    psychosocial: "Psychosocial Support",
    advocacy: "Advocacy & Rights",
    outreach: "Community Outreach",
  },
  about: {
    eyebrow: "About us",
    title: "A trans-led organisation fighting for health, rights and dignity",
    p1: "The Sankranthi Foundation is a prominent, trans-led community-based organisation in Sri Lanka dedicated to the human rights, health and well-being of the LGBTQIA+ and trans female sex worker communities.",
    p2: "We operate in conjunction with the National Transgender Network Sri Lanka and partner organisations to reach transgender women and sex workers in Colombo and Gampaha.",
    visionLabel: "Our Vision",
    vision:
      "A society where transgender women and sex workers enjoy full health, dignity, safety and equal rights.",
  },
  resources: {
    eyebrow: "Publications &",
    title: "Community Resources",
    empty: "No publications yet.",
  },
  notAlone: {
    eyebrow: "Safe spaces for all",
    title: "You Are Not Alone",
    text:
      "Sankranthi Foundation provides a safe, affirming space where trans women and sex workers can access care, connect with peers and assert their rights, free from judgement.",
  },
  newsSec: {
    eyebrow: "Latest",
    title: "News & Updates",
    empty: "No news yet.",
  },
  eventSec: {
    eyebrow: "Upcoming Event",
    fallbackTitle: "Mobile Health Clinic — Colombo & Gampaha",
    fallbackText: "Free screenings, psychosocial support and peer connection.",
  },
  partners: { eyebrow: "Our", title: "Partners & Networks" },
  getInvolved: {
    eyebrow: "Community",
    title: "Get Involved",
    intro: "There are many ways to support the Sankranthi Foundation and our community.",
    volunteer: "Volunteer",
    volunteerSub: "Join our team",
    donate: "Donate",
    donateSub: "Fund our clinics",
    partner: "Partner With Us",
    partnerSub: "Organisations & NGOs",
  },
  testimonial: {
    quote:
      "Sankranthi gave me access to health care I never thought I could get. They treated me with dignity, without judgement. I felt truly seen and supported for the first time.",
    person: "Community member (name withheld for privacy)",
    place: "Colombo, Sri Lanka",
  },
  contactBlock: {
    find: "Find Us",
    hotlineTitle: "Community Hotline",
    hotlineNote: "Medical clinic info, legal assistance & peer support",
    howTitle: "How We Can Help",
    h1: "Free mobile health clinics",
    h2: "HIV & STI screenings",
    h3: "Psychosocial counselling",
    h4: "Legal aid & advocacy",
    h5: "Peer support referrals",
  },
  message: {
    eyebrow: "Reach out",
    title: "Messages, Referrals & Partnerships",
    intro:
      "Whether you need support, want to refer someone, or want to partner with us, complete the form and our team will respond. All messages are confidential.",
  },
  newsletter: {
    label: "Stay connected",
    title: "Sign up for community updates & clinic schedules",
    placeholder: "Enter your email address",
  },
  footer: {
    blurb:
      "A trans-led community organisation in Sri Lanka providing free health clinics, psychosocial support and advocacy for transgender women and sex worker communities.",
    navigate: "Navigate",
    getInvolved: "Get Involved",
    contactUs: "Contact Us",
    aboutUs: "About us",
    ourServices: "Our Services",
    resources: "Resources",
    news: "News",
    messageFb: "Message on Facebook",
    rights: "All rights reserved.",
    tagline: "Trans-led · Community-centred · Rights-based",
  },
};

export type Dictionary = typeof en;

const si: Dictionary = {
  topbar: {
    hotline: "ප්‍රජා දුරකථන සේවාව",
    safeSpaces: "ආරක්ෂිත ඉඩකඩ",
    contactUs: "අප අමතන්න",
    chatNow: "පණිවිඩයක් යවන්න",
  },
  nav: {
    about: "අප ගැන",
    services: "සේවා",
    projects: "ව්‍යාපෘති",
    publications: "ප්‍රකාශන",
    news: "පුවත්",
    spa: "නේල් ස්පා",
    contact: "සම්බන්ධ වන්න",
    events: "සිදුවීම්",
    gallery: "ගැලරිය",
    volunteers: "ස්වේච්ඡා සේවකයෝ",
    suggestions: "යෝජනා",
    donate: "පරිත්‍යාග කරන්න",
    getHelp: "දැන් උදව් ලබාගන්න",
  },
  btn: {
    ourServices: "අපගේ සේවා",
    supportUs: "අපට සහාය වන්න",
    readMore: "තව කියවන්න",
    learnMore: "තව දැනගන්න",
    reachOut: "අප හා සම්බන්ධ වන්න",
    findSupport: "සහාය සොයන්න",
    getInTouch: "සම්බන්ධ වන්න",
    donateNow: "දැන් පරිත්‍යාග කරන්න",
    followFacebook: "Facebook හි අප අනුගමනය කරන්න",
    subscribe: "දායක වන්න",
    callToRegister: "ලියාපදිංචියට අමතන්න",
    collaborate: "එක්ව කටයුතු කරන්න",
  },
  hero: {
    title:
      "ශ්‍රී ලංකාවේ සංක්‍රාන්ති කාන්තාවන් සහ ලිංගික සේවා ප්‍රජාවන් සඳහා ට්‍රාන්ස් නායකත්වයෙන් යුත් සත්කාරය",
    latestUpdate: "නවතම යාවත්කාලීන:",
    featured: "ජංගම සෞඛ්‍ය සායනය — කොළඹ සහ ගම්පහ ට්‍රාන්ස් කාන්තාවන් සඳහා නොමිලේ පරීක්ෂණ",
  },
  services: {
    eyebrow: "ප්‍රජා සෞඛ්‍ය සහ සහාය",
    title: "ට්‍රාන්ස් කාන්තාවන් සහ ලිංගික සේවකයින් සඳහා අපගේ සේවා",
    intro:
      "LGBTQIA+ සහ ට්‍රාන්ස් ලිංගික සේවා ප්‍රජාව සඳහා නොමිලේ, රහසිගත සහ විනිශ්චයෙන් තොර සෞඛ්‍ය සේවා, මනෝසමාජීය සහාය සහ නීතිමය උපදේශනය.",
  },
  community: {
    eyebrow: "අප ඉටු කරන්නේ",
    title: "ප්‍රජාව සඳහා",
    clinics: "ට්‍රාන්ස් සෞඛ්‍ය සායන",
    psychosocial: "මනෝසමාජීය සහාය",
    advocacy: "උපදේශනය සහ අයිතිවාසිකම්",
    outreach: "ප්‍රජා ව්‍යාප්තිය",
  },
  about: {
    eyebrow: "අප ගැන",
    title: "සෞඛ්‍යය, අයිතිවාසිකම් සහ ගෞරවය වෙනුවෙන් සටන් කරන ට්‍රාන්ස් නායකත්ව සංවිධානයක්",
    p1: "සංක්‍රාන්ති පදනම යනු LGBTQIA+ සහ ට්‍රාන්ස් ලිංගික සේවා ප්‍රජාවන්ගේ මානව හිමිකම්, සෞඛ්‍යය සහ යහපැවැත්ම වෙනුවෙන් කැපවී සිටින ශ්‍රී ලංකාවේ ප්‍රමුඛ ට්‍රාන්ස් නායකත්ව ප්‍රජා සංවිධානයකි.",
    p2: "කොළඹ සහ ගම්පහ ට්‍රාන්ස් කාන්තාවන් සහ ලිංගික සේවකයින් වෙත ළඟා වීම සඳහා අපි ජාතික ට්‍රාන්ස්ජෙන්ඩර් ජාලය සහ හවුල්කාර සංවිධාන සමඟ කටයුතු කරමු.",
    visionLabel: "අපගේ දැක්ම",
    vision:
      "ට්‍රාන්ස් කාන්තාවන් සහ ලිංගික සේවකයින් සම්පූර්ණ සෞඛ්‍යය, ගෞරවය, ආරක්ෂාව සහ සමාන අයිතිවාසිකම් භුක්ති විඳින සමාජයක්.",
  },
  resources: {
    eyebrow: "ප්‍රකාශන සහ",
    title: "ප්‍රජා සම්පත්",
    empty: "තවම ප්‍රකාශන නොමැත.",
  },
  notAlone: {
    eyebrow: "සියල්ලන් සඳහා ආරක්ෂිත ඉඩකඩ",
    title: "ඔබ තනිවම නොවේ",
    text:
      "සංක්‍රාන්ති පදනම ට්‍රාන්ස් කාන්තාවන් සහ ලිංගික සේවකයින්ට විනිශ්චයෙන් තොරව සත්කාර ලබා ගැනීමට, සම වයසේ අය සමඟ සම්බන්ධ වීමට සහ ඔවුන්ගේ අයිතිවාසිකම් තහවුරු කර ගැනීමට ආරක්ෂිත ඉඩක් සපයයි.",
  },
  newsSec: { eyebrow: "නවතම", title: "පුවත් සහ යාවත්කාලීන", empty: "තවම පුවත් නොමැත." },
  eventSec: {
    eyebrow: "ඉදිරි සිදුවීම",
    fallbackTitle: "ජංගම සෞඛ්‍ය සායනය — කොළඹ සහ ගම්පහ",
    fallbackText: "නොමිලේ පරීක්ෂණ, මනෝසමාජීය සහාය සහ ප්‍රජා සම්බන්ධතාව.",
  },
  partners: { eyebrow: "අපගේ", title: "හවුල්කරුවන් සහ ජාල" },
  getInvolved: {
    eyebrow: "ප්‍රජාව",
    title: "සම්බන්ධ වන්න",
    intro: "සංක්‍රාන්ති පදනමට සහ අපගේ ප්‍රජාවට සහාය වීමට බොහෝ ක්‍රම තිබේ.",
    volunteer: "ස්වේච්ඡා සේවය",
    volunteerSub: "අපගේ කණ්ඩායමට එක්වන්න",
    donate: "පරිත්‍යාග කරන්න",
    donateSub: "අපගේ සායන සඳහා අරමුදල් සපයන්න",
    partner: "අප සමඟ හවුල් වන්න",
    partnerSub: "සංවිධාන සහ රාජ්‍ය නොවන සංවිධාන",
  },
  testimonial: {
    quote:
      "සංක්‍රාන්ති මට කිසිදා ලැබෙතැයි නොසිතූ සෞඛ්‍ය සේවා වෙත ප්‍රවේශය ලබා දුන්නා. ඔවුන් මට විනිශ්චයෙන් තොරව ගෞරවයෙන් සැලකුවා. පළමු වරට මම සැබවින්ම දුටු සහ සහාය දුන් බව මට දැනුනා.",
    person: "ප්‍රජා සාමාජිකයෙක් (පෞද්ගලිකත්වය සඳහා නම සඟවා ඇත)",
    place: "කොළඹ, ශ්‍රී ලංකාව",
  },
  contactBlock: {
    find: "අප සොයන්න",
    hotlineTitle: "ප්‍රජා දුරකථන සේවාව",
    hotlineNote: "වෛද්‍ය සායන තොරතුරු, නීතිමය සහාය සහ ප්‍රජා සහාය",
    howTitle: "අපට උදව් කළ හැකි ආකාරය",
    h1: "නොමිලේ ජංගම සෞඛ්‍ය සායන",
    h2: "HIV සහ STI පරීක්ෂණ",
    h3: "මනෝසමාජීය උපදේශනය",
    h4: "නීති ආධාර සහ උපදේශනය",
    h5: "ප්‍රජා සහාය යොමු කිරීම්",
  },
  message: {
    eyebrow: "අප හා සම්බන්ධ වන්න",
    title: "පණිවිඩ, යොමු කිරීම් සහ හවුල්කාරිත්ව",
    intro:
      "ඔබට සහාය අවශ්‍ය වුවත්, යමෙකු යොමු කිරීමට හෝ අප සමඟ හවුල් වීමට වුවත්, පෝරමය සම්පූර්ණ කරන්න, අපගේ කණ්ඩායම ප්‍රතිචාර දක්වනු ඇත. සියලුම පණිවිඩ රහසිගතයි.",
  },
  newsletter: {
    label: "සම්බන්ධව සිටින්න",
    title: "ප්‍රජා යාවත්කාලීන සහ සායන කාලසටහන් සඳහා ලියාපදිංචි වන්න",
    placeholder: "ඔබගේ විද්‍යුත් තැපැල් ලිපිනය ඇතුළත් කරන්න",
  },
  footer: {
    blurb:
      "ට්‍රාන්ස් කාන්තාවන් සහ ලිංගික සේවා ප්‍රජාවන් සඳහා නොමිලේ සෞඛ්‍ය සායන, මනෝසමාජීය සහාය සහ උපදේශනය සපයන ශ්‍රී ලංකාවේ ට්‍රාන්ස් නායකත්ව ප්‍රජා සංවිධානයකි.",
    navigate: "සංචලනය",
    getInvolved: "සම්බන්ධ වන්න",
    contactUs: "අප අමතන්න",
    aboutUs: "අප ගැන",
    ourServices: "අපගේ සේවා",
    resources: "සම්පත්",
    news: "පුවත්",
    messageFb: "Facebook හි පණිවිඩයක් යවන්න",
    rights: "සියලු හිමිකම් ඇවිරිණි.",
    tagline: "ට්‍රාන්ස් නායකත්වය · ප්‍රජා කේන්ද්‍රීය · අයිතිවාසිකම් පදනම්",
  },
};

const ta: Dictionary = {
  topbar: {
    hotline: "சமூக தொலைபேசி சேவை",
    safeSpaces: "பாதுகாப்பான இடங்கள்",
    contactUs: "எங்களை தொடர்பு கொள்ள",
    chatNow: "இப்போது அரட்டையடி",
  },
  nav: {
    about: "எங்களைப் பற்றி",
    services: "சேவைகள்",
    projects: "திட்டங்கள்",
    publications: "வெளியீடுகள்",
    news: "செய்திகள்",
    spa: "நெயில் ஸ்பா",
    contact: "தொடர்பு",
    events: "நிகழ்வுகள்",
    gallery: "படத்தொகுப்பு",
    volunteers: "தன்னார்வலர்கள்",
    suggestions: "பரிந்துரைகள்",
    donate: "நன்கொடை",
    getHelp: "இப்போது உதவி பெறுங்கள்",
  },
  btn: {
    ourServices: "எங்கள் சேவைகள்",
    supportUs: "எங்களை ஆதரியுங்கள்",
    readMore: "மேலும் படிக்க",
    learnMore: "மேலும் அறிக",
    reachOut: "எங்களை அணுகுங்கள்",
    findSupport: "ஆதரவைக் கண்டறியுங்கள்",
    getInTouch: "தொடர்பு கொள்ளுங்கள்",
    donateNow: "இப்போது நன்கொடை",
    followFacebook: "Facebook இல் பின்தொடருங்கள்",
    subscribe: "பதிவு செய்யுங்கள்",
    callToRegister: "பதிவு செய்ய அழைக்கவும்",
    collaborate: "இணைந்து பணியாற்றுங்கள்",
  },
  hero: {
    title:
      "இலங்கையில் திருநங்கை பெண்கள் மற்றும் பாலியல் தொழிலாளர் சமூகங்களுக்கான திருநர் தலைமையிலான பராமரிப்பு",
    latestUpdate: "சமீபத்திய புதுப்பிப்பு:",
    featured: "நடமாடும் சுகாதார கிளினிக் — கொழும்பு & கம்பஹாவில் திருநங்கை பெண்களுக்கு இலவச பரிசோதனைகள்",
  },
  services: {
    eyebrow: "சமூக சுகாதாரம் & ஆதரவு",
    title: "திருநங்கை பெண்கள் & பாலியல் தொழிலாளர்களுக்கான எங்கள் சேவைகள்",
    intro:
      "LGBTQIA+ மற்றும் திருநங்கை பாலியல் தொழிலாளர் சமூகத்திற்கு இலவச, ரகசிய மற்றும் தீர்ப்பற்ற சுகாதார பராமரிப்பு, உளசமூக ஆதரவு மற்றும் சட்ட ஆதரவு.",
  },
  community: {
    eyebrow: "நாங்கள் செய்வது",
    title: "சமூகத்திற்காக",
    clinics: "திருநர் சுகாதார கிளினிக்குகள்",
    psychosocial: "உளசமூக ஆதரவு",
    advocacy: "வக்காலத்து & உரிமைகள்",
    outreach: "சமூக சேவை",
  },
  about: {
    eyebrow: "எங்களைப் பற்றி",
    title: "சுகாதாரம், உரிமைகள் மற்றும் கண்ணியத்திற்காக போராடும் திருநர் தலைமையிலான அமைப்பு",
    p1: "சங்கராந்தி அறக்கட்டளை என்பது LGBTQIA+ மற்றும் திருநங்கை பாலியல் தொழிலாளர் சமூகங்களின் மனித உரிமைகள், சுகாதாரம் மற்றும் நல்வாழ்வுக்காக அர்ப்பணிக்கப்பட்ட இலங்கையின் முன்னணி திருநர் தலைமையிலான சமூக அமைப்பாகும்.",
    p2: "கொழும்பு மற்றும் கம்பஹாவில் திருநங்கை பெண்கள் மற்றும் பாலியல் தொழிலாளர்களை அடைய தேசிய திருநர் வலையமைப்பு மற்றும் கூட்டாளர் அமைப்புகளுடன் நாங்கள் இணைந்து செயல்படுகிறோம்.",
    visionLabel: "எங்கள் நோக்கம்",
    vision:
      "திருநங்கை பெண்கள் மற்றும் பாலியல் தொழிலாளர்கள் முழு சுகாதாரம், கண்ணியம், பாதுகாப்பு மற்றும் சம உரிமைகளை அனுபவிக்கும் ஒரு சமூகம்.",
  },
  resources: {
    eyebrow: "வெளியீடுகள் &",
    title: "சமூக வளங்கள்",
    empty: "இன்னும் வெளியீடுகள் இல்லை.",
  },
  notAlone: {
    eyebrow: "அனைவருக்கும் பாதுகாப்பான இடங்கள்",
    title: "நீங்கள் தனியாக இல்லை",
    text:
      "சங்கராந்தி அறக்கட்டளை திருநங்கை பெண்கள் மற்றும் பாலியல் தொழிலாளர்கள் தீர்ப்பின்றி பராமரிப்பைப் பெறவும், சகாக்களுடன் இணையவும், தங்கள் உரிமைகளை உறுதிப்படுத்தவும் ஒரு பாதுகாப்பான இடத்தை வழங்குகிறது.",
  },
  newsSec: { eyebrow: "சமீபத்திய", title: "செய்திகள் & புதுப்பிப்புகள்", empty: "இன்னும் செய்திகள் இல்லை." },
  eventSec: {
    eyebrow: "வரவிருக்கும் நிகழ்வு",
    fallbackTitle: "நடமாடும் சுகாதார கிளினிக் — கொழும்பு & கம்பஹா",
    fallbackText: "இலவச பரிசோதனைகள், உளசமூக ஆதரவு மற்றும் சக தொடர்பு.",
  },
  partners: { eyebrow: "எங்கள்", title: "கூட்டாளர்கள் & வலையமைப்புகள்" },
  getInvolved: {
    eyebrow: "சமூகம்",
    title: "பங்கேற்கவும்",
    intro: "சங்கராந்தி அறக்கட்டளை மற்றும் எங்கள் சமூகத்தை ஆதரிக்க பல வழிகள் உள்ளன.",
    volunteer: "தன்னார்வலராகுங்கள்",
    volunteerSub: "எங்கள் குழுவில் இணையுங்கள்",
    donate: "நன்கொடை",
    donateSub: "எங்கள் கிளினிக்குகளுக்கு நிதி",
    partner: "எங்களுடன் இணையுங்கள்",
    partnerSub: "அமைப்புகள் & தன்னார்வ நிறுவனங்கள்",
  },
  testimonial: {
    quote:
      "நான் ஒருபோதும் பெற முடியாது என்று நினைத்த சுகாதார பராமரிப்பை சங்கராந்தி எனக்கு வழங்கியது. அவர்கள் என்னை தீர்ப்பின்றி கண்ணியத்துடன் நடத்தினர். முதல் முறையாக நான் உண்மையிலேயே பார்க்கப்பட்டதாகவும் ஆதரிக்கப்பட்டதாகவும் உணர்ந்தேன்.",
    person: "சமூக உறுப்பினர் (தனியுரிமைக்காக பெயர் மறைக்கப்பட்டது)",
    place: "கொழும்பு, இலங்கை",
  },
  contactBlock: {
    find: "எங்களைக் கண்டறியுங்கள்",
    hotlineTitle: "சமூக தொலைபேசி சேவை",
    hotlineNote: "மருத்துவ கிளினிக் தகவல், சட்ட உதவி & சக ஆதரவு",
    howTitle: "நாங்கள் எப்படி உதவ முடியும்",
    h1: "இலவச நடமாடும் சுகாதார கிளினிக்குகள்",
    h2: "HIV & STI பரிசோதனைகள்",
    h3: "உளசமூக ஆலோசனை",
    h4: "சட்ட உதவி & வக்காலத்து",
    h5: "சக ஆதரவு பரிந்துரைகள்",
  },
  message: {
    eyebrow: "எங்களை அணுகுங்கள்",
    title: "செய்திகள், பரிந்துரைகள் & கூட்டாண்மைகள்",
    intro:
      "உங்களுக்கு ஆதரவு தேவைப்பட்டாலும், ஒருவரைப் பரிந்துரைக்க விரும்பினாலும், அல்லது எங்களுடன் இணைய விரும்பினாலும், படிவத்தை நிரப்புங்கள், எங்கள் குழு பதிலளிக்கும். அனைத்து செய்திகளும் ரகசியமானவை.",
  },
  newsletter: {
    label: "தொடர்பில் இருங்கள்",
    title: "சமூக புதுப்பிப்புகள் & கிளினிக் அட்டவணைகளுக்கு பதிவு செய்யுங்கள்",
    placeholder: "உங்கள் மின்னஞ்சல் முகவரியை உள்ளிடவும்",
  },
  footer: {
    blurb:
      "திருநங்கை பெண்கள் மற்றும் பாலியல் தொழிலாளர் சமூகங்களுக்கு இலவச சுகாதார கிளினிக்குகள், உளசமூக ஆதரவு மற்றும் வக்காலத்து வழங்கும் இலங்கையின் திருநர் தலைமையிலான சமூக அமைப்பு.",
    navigate: "வழிசெலுத்தல்",
    getInvolved: "பங்கேற்கவும்",
    contactUs: "எங்களை தொடர்பு கொள்ள",
    aboutUs: "எங்களைப் பற்றி",
    ourServices: "எங்கள் சேவைகள்",
    resources: "வளங்கள்",
    news: "செய்திகள்",
    messageFb: "Facebook இல் செய்தி அனுப்பவும்",
    rights: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    tagline: "திருநர் தலைமை · சமூக மையம் · உரிமை அடிப்படையிலானது",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, si, ta };
