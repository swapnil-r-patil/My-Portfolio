import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, inMemoryPersistence } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

import {
    DEFAULT_HERO, DEFAULT_STATS, DEFAULT_ABOUT, DEFAULT_SKILLS,
    DEFAULT_PROJECTS, DEFAULT_ACHIEVEMENTS, DEFAULT_EXPERIENCES,
    DEFAULT_CONTACT, DEFAULT_NAVBAR, DEFAULT_FOOTER, DEFAULT_NAV_LINKS,
    DEFAULT_CUSTOM_SECTIONS, DEFAULT_CONTACT_LINKS
} from "@/constants/defaultData";

// ─── Helper ───────────────────────────────────────────────────────────────────

function load<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

function save<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type NavLinkItem = (typeof DEFAULT_NAV_LINKS)[0];
export type CustomSection = { id: string; title: string; content: string };
export type ContactLinkItem = { type: string; label: string; url: string; iconUrl?: string };
export type HeroData = typeof DEFAULT_HERO;
export type StatItem = (typeof DEFAULT_STATS)[0];
export type AboutData = typeof DEFAULT_ABOUT;
export type SkillGroup = (typeof DEFAULT_SKILLS)[0];
export type ProjectItem = {
    title: string;
    description: string;
    tech: string[];
    featured: boolean;
    github: string;
    live: string;
    images?: string[];
    showImage?: boolean;
    screenshotCount?: number;
};
export type AchievementItem = (typeof DEFAULT_ACHIEVEMENTS)[0];
export type ExperienceItem = (typeof DEFAULT_EXPERIENCES)[0];
export type ContactData = typeof DEFAULT_CONTACT;
export type NavbarData = typeof DEFAULT_NAVBAR;
export type FooterData = typeof DEFAULT_FOOTER;

interface AdminContextValue {
    isAdmin: boolean;
    loginWithFirebase: (email: string, password: string) => Promise<void>;
    logout: () => void;

    hero: HeroData;
    setHero: (d: HeroData) => void;

    stats: StatItem[];
    setStats: (d: StatItem[]) => void;

    about: AboutData;
    setAbout: (d: AboutData) => void;

    skills: SkillGroup[];
    setSkills: (d: SkillGroup[]) => void;

    projects: ProjectItem[];
    setProjects: (d: ProjectItem[]) => void;

    achievements: AchievementItem[];
    setAchievements: (d: AchievementItem[]) => void;

    experiences: ExperienceItem[];
    setExperiences: (d: ExperienceItem[]) => void;

    contact: ContactData;
    setContact: (d: ContactData) => void;

    navbar: NavbarData;
    setNavbar: (d: NavbarData) => void;

    footer: FooterData;
    setFooter: (d: FooterData) => void;

    navLinks: NavLinkItem[];
    setNavLinks: (d: NavLinkItem[]) => void;

    customSections: CustomSection[];
    setCustomSections: (d: CustomSection[]) => void;

    contactLinks: ContactLinkItem[];
    setContactLinks: (d: ContactLinkItem[]) => void;

    showBot: boolean;
    setBotVisibility: (v: boolean) => void;

    showAdminControls: boolean;
    setShowAdminControls: (v: boolean) => void;
    isLoading: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AdminContext = createContext<AdminContextValue | null>(null);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [hero, _setHero] = useState<HeroData>(DEFAULT_HERO);
    const [stats, _setStats] = useState<StatItem[]>(DEFAULT_STATS);
    const [about, _setAbout] = useState<AboutData>(DEFAULT_ABOUT);
    const [skills, _setSkills] = useState<SkillGroup[]>(DEFAULT_SKILLS);
    const [projects, _setProjects] = useState<ProjectItem[]>(DEFAULT_PROJECTS);
    const [achievements, _setAchievements] = useState<AchievementItem[]>(DEFAULT_ACHIEVEMENTS);
    const [experiences, _setExperiences] = useState<ExperienceItem[]>(DEFAULT_EXPERIENCES);
    const [contact, _setContact] = useState<ContactData>(DEFAULT_CONTACT);
    const [navbar, _setNavbar] = useState<NavbarData>(DEFAULT_NAVBAR);
    const [footer, _setFooter] = useState<FooterData>(DEFAULT_FOOTER);
    const [navLinks, _setNavLinks] = useState<NavLinkItem[]>(DEFAULT_NAV_LINKS);
    const [customSections, _setCustomSections] = useState<CustomSection[]>(DEFAULT_CUSTOM_SECTIONS);
    const [contactLinks, _setContactLinks] = useState<ContactLinkItem[]>(DEFAULT_CONTACT_LINKS);
    const [showBot, _setShowBot] = useState<boolean>(true);
    const [showAdminControls, _setShowAdminControls] = useState<boolean>(true);

    useEffect(() => {
        setPersistence(auth, inMemoryPersistence).catch(() => { });
        signOut(auth).catch(() => { });
        const unsubAuth = onAuthStateChanged(auth, (user) => {
            setIsAdmin(!!user);
        });

        // ─── Fetch global website content ───
        const unsubContent = onSnapshot(doc(db, "content", "website"), (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                if (data.hero) _setHero(data.hero);
                if (data.stats) _setStats(data.stats);
                if (data.about) _setAbout(data.about);
                if (data.skills) _setSkills(data.skills);
                if (data.projects) _setProjects(data.projects);
                if (data.achievements) _setAchievements(data.achievements);
                if (data.experiences) _setExperiences(data.experiences);
                if (data.contact) _setContact(data.contact);
                if (data.navbar) _setNavbar(data.navbar);
                if (data.footer) _setFooter(data.footer);
                if (data.navLinks) _setNavLinks(data.navLinks);
                if (data.customSections) _setCustomSections(data.customSections);
                if (data.contactLinks) _setContactLinks(data.contactLinks);
                if (data.showBot !== undefined) _setShowBot(data.showBot);
                if (data.showAdminControls !== undefined) _setShowAdminControls(data.showAdminControls);
            } else {
                // If the doc doesn't exist yet, we can try to migrate from localStorage once
                const localHero = load("portfolio_hero", null);
                if (localHero) {
                    const migrationData = {
                        hero: load("portfolio_hero", DEFAULT_HERO),
                        stats: load("portfolio_stats", DEFAULT_STATS),
                        about: load("portfolio_about", DEFAULT_ABOUT),
                        skills: load("portfolio_skills", DEFAULT_SKILLS),
                        projects: load("portfolio_projects", DEFAULT_PROJECTS),
                        achievements: load("portfolio_achievements", DEFAULT_ACHIEVEMENTS),
                        experiences: load("portfolio_experiences", DEFAULT_EXPERIENCES),
                        contact: load("portfolio_contact", DEFAULT_CONTACT),
                        navbar: load("portfolio_navbar", DEFAULT_NAVBAR),
                        footer: load("portfolio_footer", DEFAULT_FOOTER),
                        navLinks: load("portfolio_nav_links", DEFAULT_NAV_LINKS),
                        customSections: load("portfolio_custom_sections", DEFAULT_CUSTOM_SECTIONS),
                        contactLinks: load("portfolio_contact_links", DEFAULT_CONTACT_LINKS),
                        showBot: load("portfolio_show_bot", true),
                        showAdminControls: load("portfolio_show_admin_controls", true),
                    };
                    saveToFirestore(migrationData);

                    // Immediately apply local data so the site doesn't flicker defaults
                    _setHero(migrationData.hero);
                    _setStats(migrationData.stats);
                    _setAbout(migrationData.about);
                    _setSkills(migrationData.skills);
                    _setProjects(migrationData.projects);
                    _setAchievements(migrationData.achievements);
                    _setExperiences(migrationData.experiences);
                    _setContact(migrationData.contact);
                    _setNavbar(migrationData.navbar);
                    _setFooter(migrationData.footer);
                    _setNavLinks(migrationData.navLinks);
                    _setCustomSections(migrationData.customSections);
                    _setContactLinks(migrationData.contactLinks);
                    _setShowBot(migrationData.showBot);
                    _setShowAdminControls(migrationData.showAdminControls);
                }
            }
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching content:", error);
            setIsLoading(false);
        });

        return () => {
            unsubAuth();
            unsubContent();
        };
    }, []);

    const saveToFirestore = async (updates: Partial<any>) => {
        try {
            const ref = doc(db, "content", "website");
            // We use merge: true so we don't overwrite everything if we only send one part
            await setDoc(ref, updates, { merge: true });
        } catch (error) {
            console.error("Error saving to Firestore:", error);
        }
    };

    const loginWithFirebase = async (email: string, password: string) => {
        await setPersistence(auth, inMemoryPersistence);
        await signInWithEmailAndPassword(auth, email, password);
        setIsAdmin(true);
    };

    const logout = () => {
        signOut(auth);
        setIsAdmin(false);
    };

    const setHero = (d: HeroData) => { _setHero(d); saveToFirestore({ hero: d }); };
    const setStats = (d: StatItem[]) => { _setStats(d); saveToFirestore({ stats: d }); };
    const setAbout = (d: AboutData) => { _setAbout(d); saveToFirestore({ about: d }); };
    const setSkills = (d: SkillGroup[]) => { _setSkills(d); saveToFirestore({ skills: d }); };
    const setProjects = (d: ProjectItem[]) => { _setProjects(d); saveToFirestore({ projects: d }); };
    const setAchievements = (d: AchievementItem[]) => { _setAchievements(d); saveToFirestore({ achievements: d }); };
    const setExperiences = (d: ExperienceItem[]) => { _setExperiences(d); saveToFirestore({ experiences: d }); };
    const setContact = (d: ContactData) => { _setContact(d); saveToFirestore({ contact: d }); };
    const setNavbar = (d: NavbarData) => { _setNavbar(d); saveToFirestore({ navbar: d }); };
    const setFooter = (d: FooterData) => { _setFooter(d); saveToFirestore({ footer: d }); };
    const setNavLinks = (d: NavLinkItem[]) => { _setNavLinks(d); saveToFirestore({ navLinks: d }); };
    const setCustomSections = (d: CustomSection[]) => { _setCustomSections(d); saveToFirestore({ customSections: d }); };
    const setContactLinks = (d: ContactLinkItem[]) => { _setContactLinks(d); saveToFirestore({ contactLinks: d }); };
    const setBotVisibility = (v: boolean) => { _setShowBot(v); saveToFirestore({ showBot: v }); };
    const setShowAdminControls = (v: boolean) => { _setShowAdminControls(v); saveToFirestore({ showAdminControls: v }); };

    return (
        <AdminContext.Provider
            value={{
                isAdmin,
                loginWithFirebase,
                logout,
                hero, setHero,
                stats, setStats,
                about, setAbout,
                skills, setSkills,
                projects, setProjects,
                achievements, setAchievements,
                experiences, setExperiences,
                contact, setContact,
                navbar, setNavbar,
                footer, setFooter,
                navLinks, setNavLinks,
                customSections, setCustomSections,
                contactLinks, setContactLinks,
                showBot, setBotVisibility,
                showAdminControls, setShowAdminControls,
                isLoading
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = (): AdminContextValue => {
    const ctx = useContext(AdminContext);
    if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
    return ctx;
};
