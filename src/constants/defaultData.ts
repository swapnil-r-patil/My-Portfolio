export const DEFAULT_HERO = {
    greeting: "Hello, I'm",
    name: "Swapnil",
    lastName: "Patil",
    tagline:
        "Engineering scalable, high-performance systems with clean architecture and a production-first mindset. Turning complex problems into elegant, maintainable solutions.",
    roles: [
        "Full-Stack Performance Engineer",
        "Backend Systems Builder",
        "AI-Driven Web Developer",
        "Scalable Solutions Architect",
    ],
};

export const DEFAULT_STATS = [
    { label: "Projects Built", value: "15+" },
    { label: "Technologies", value: "20+" },
    { label: "IBM Certified", value: "✓" },
    { label: "National Medalist", value: "✓" },
];

export const DEFAULT_ABOUT = {
    heading: "Building the future,",
    headingHighlight: "one system at a time",
    paragraphs: [
        "I'm a Computer Engineering student graduating in 2026 from Maharashtra, India, with a deep passion for building systems that scale. My focus lies at the intersection of backend engineering, AI integration, and full-stack development.",
        "I believe in writing code that is not just functional, but maintainable and performant. Every project I take on is driven by a problem-solving mindset — from designing efficient database schemas to crafting seamless user experiences.",
        "Beyond tech, I'm a national-level athlete who brings the same discipline and competitive drive to software engineering. I thrive in environments that push me to grow, learn, and deliver real-world impact.",
    ],
    highlights: [
        { title: "Clean Code", value: "Always", icon: "Code2" },
        { title: "Performance", value: "Priority", icon: "Zap" },
        { title: "Goal", value: "Impact", icon: "Target" },
    ],
};

export const DEFAULT_SKILLS = [
    {
        title: "Languages",
        skills: ["JavaScript", "TypeScript", "Python", "Java", "C++", "SQL"],
    },
    {
        title: "Frontend",
        skills: ["React", "Next.js", "Tailwind CSS", "HTML5", "CSS3", "Framer Motion"],
    },
    {
        title: "Backend & Tools",
        skills: ["Node.js", "Express", "MongoDB", "PostgreSQL", "Firebase", "Git", "Docker", "REST APIs"],
    },
    {
        title: "Core CS",
        skills: ["Data Structures", "Algorithms", "System Design", "OOP", "DBMS", "OS"],
    },
];

export const DEFAULT_PROJECTS = [
    {
        title: "Multi-User To-Do Application",
        description:
            "A collaborative task management platform with real-time updates, user authentication, and role-based access control.",
        tech: ["React", "Node.js", "MongoDB", "Socket.io"],
        featured: true,
        github: "#",
        live: "#",
        images: [],
        showImage: false,
        screenshotCount: 1,
    },
    {
        title: "AI Shoe Recommendation",
        description:
            "AI-powered shoe recommendation engine with voice AI integration for hands-free shopping experiences.",
        tech: ["Python", "React", "TensorFlow", "Voice AI"],
        featured: false,
        github: "#",
        live: "#",
        images: [],
        showImage: false,
        screenshotCount: 1,
    },
    {
        title: "Real-Time Group Chat",
        description:
            "Scalable group chat application with WebSocket-based messaging, media sharing, and online presence indicators.",
        tech: ["React", "Express", "Socket.io", "PostgreSQL"],
        featured: false,
        github: "#",
        live: "#",
        images: [],
        showImage: false,
        screenshotCount: 1,
    },
    {
        title: "Social Media Management",
        description:
            "Comprehensive social media management dashboard for scheduling posts, analytics tracking, and multi-platform integration.",
        tech: ["Next.js", "Tailwind", "REST APIs", "Firebase"],
        featured: false,
        github: "#",
        live: "#",
        images: [],
        showImage: false,
        screenshotCount: 1,
    },
];

export const DEFAULT_ACHIEVEMENTS = [
    {
        title: "IBM Certification",
        description:
            "Certified in IBM cloud and AI technologies, validating expertise in enterprise-grade solutions.",
        year: "2024",
    },
    {
        title: "National Level Athlete",
        description:
            "Represented at national level in athletics, demonstrating discipline and competitive spirit.",
        year: "2023",
    },
    {
        title: "TalentBattle Internship",
        description:
            "Completed intensive internship program focusing on full-stack development and industry practices.",
        year: "2024",
    },
    {
        title: "INTELLECTA Achievement",
        description:
            "Recognized at INTELLECTA for outstanding performance in technical competitions and innovation.",
        year: "2024",
    },
];

export const DEFAULT_EXPERIENCES = [
    {
        role: "Full-Stack Development Intern",
        company: "TalentBattle",
        period: "2024",
        description:
            "Built production-ready web applications using modern JavaScript frameworks. Collaborated on backend APIs, database design, and frontend interfaces.",
        highlights: ["React Development", "Node.js APIs", "Database Design"],
    },
];

export const DEFAULT_CONTACT = {
    subtitle: "Have a project in mind or want to collaborate? I'd love to hear from you.",
    email: "swapnilpatil@example.com",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
};

export const DEFAULT_NAVBAR = { logo: "S.Patil" };
export const DEFAULT_FOOTER = { copyright: "Swapnil Patil. Built with precision." };
export const DEFAULT_NAV_LINKS = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Achievements", href: "#achievements" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
];
export const DEFAULT_CUSTOM_SECTIONS: { id: string; title: string; content: string }[] = [];
export const DEFAULT_CONTACT_LINKS = [
    { type: "Mail", label: "Email", url: "swapnilpatil@gmail.com", iconUrl: "" },
    { type: "Github", label: "GitHub", url: "https://github.com/", iconUrl: "" },
    { type: "Linkedin", label: "LinkedIn", url: "https://linkedin.com/in/", iconUrl: "" },
];
