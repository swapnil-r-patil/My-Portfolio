/**
 * Shared admin icon picker.
 * Usage:
 *   <IconPickerGrid selected={iconName} onSelect={(name) => ...} showImageUrl iconUrl={...} onIconUrlChange={...} />
 */
import {
    Code2, Zap, Target, Star, Rocket, Heart, Award, Cpu, Globe,
    Briefcase, BookOpen, Coffee, Database, Layers, Monitor,
    Music, PenTool, Shield, Smile, Wifi, Mail, Github, Linkedin,
    Twitter, Phone, Youtube, Link,
} from "lucide-react";

export const ICON_MAP: Record<string, React.ElementType> = {
    Code2, Zap, Target, Star, Rocket, Heart, Award, Cpu, Globe,
    Briefcase, BookOpen, Coffee, Database, Layers, Monitor,
    Music, PenTool, Shield, Smile, Wifi, Mail, Github, Linkedin,
    Twitter, Phone, Youtube, Link,
};

export const ICON_NAMES = Object.keys(ICON_MAP);

interface Props {
    selected: string;                    // icon name key, e.g. "Code2"
    onSelect: (name: string) => void;
    showImageUrl?: boolean;              // show custom image URL field
    iconUrl?: string;
    onIconUrlChange?: (url: string) => void;
}

export function IconPickerGrid({ selected, onSelect, showImageUrl, iconUrl, onIconUrlChange }: Props) {
    return (
        <div className="space-y-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Choose Icon</p>

            {/* Grid of all icons */}
            <div className="grid grid-cols-7 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {ICON_NAMES.map((name) => {
                    const Icon = ICON_MAP[name];
                    const isSelected = selected === name;
                    return (
                        <button
                            key={name}
                            type="button"
                            onClick={() => onSelect(name)}
                            title={name}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isSelected
                                    ? "bg-primary text-primary-foreground shadow-md scale-110"
                                    : "bg-muted/60 text-muted-foreground hover:bg-primary/20 hover:text-primary"
                                }`}
                        >
                            <Icon size={14} />
                        </button>
                    );
                })}

                {/* Custom image option */}
                <button
                    type="button"
                    onClick={() => onSelect("custom")}
                    title="Custom image"
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-bold transition-all border ${selected === "custom"
                            ? "bg-primary text-primary-foreground border-primary scale-110"
                            : "bg-muted/60 text-muted-foreground hover:text-primary border-dashed border-muted-foreground/40"
                        }`}
                >
                    IMG
                </button>
            </div>

            {/* Custom image URL field — shown when "custom" selected OR showImageUrl is true */}
            {(selected === "custom" || showImageUrl) && onIconUrlChange && (
                <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground">Custom icon URL (image or emoji)</p>
                    <input
                        value={iconUrl ?? ""}
                        onChange={(e) => onIconUrlChange(e.target.value)}
                        placeholder="https://… or paste an emoji 🚀"
                        className="w-full bg-muted/60 border border-border rounded-lg px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary"
                    />
                    {iconUrl && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Preview:</span>
                            {iconUrl.startsWith("http") ? (
                                <img src={iconUrl} alt="icon preview" className="w-6 h-6 rounded object-contain" />
                            ) : (
                                <span className="text-xl">{iconUrl}</span>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/** Render an icon by its name key, falling back to a custom image/emoji */
export function DynamicIcon({
    iconName, iconUrl, size = 20, className = "text-primary",
}: { iconName?: string; iconUrl?: string; size?: number; className?: string }) {
    if (iconName && iconName !== "custom" && ICON_MAP[iconName]) {
        const Icon = ICON_MAP[iconName];
        return <Icon size={size} className={className} />;
    }
    if (iconUrl) {
        if (iconUrl.startsWith("http")) {
            return <img src={iconUrl} alt="icon" style={{ width: size, height: size }} className="object-contain rounded" />;
        }
        // treat as emoji / text
        return <span style={{ fontSize: size }} className="leading-none">{iconUrl}</span>;
    }
    const Icon = ICON_MAP["Code2"];
    return <Icon size={size} className={className} />;
}
