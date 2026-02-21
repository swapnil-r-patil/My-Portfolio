import { useEffect, useRef, useState } from "react";

interface Pupil {
    x: number;
    y: number;
}

/** Calculates pupil offset (clamped radius) from eye center toward mouse */
function getPupilOffset(
    eyeEl: HTMLElement | null,
    mouseX: number,
    mouseY: number,
    maxRadius: number
): Pupil {
    if (!eyeEl) return { x: 0, y: 0 };
    const rect = eyeEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = mouseX - cx;
    const dy = mouseY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return { x: 0, y: 0 };
    const scale = Math.min(dist, maxRadius) / dist;
    return { x: dx * scale, y: dy * scale };
}

export default function EyeFollower({ className = "" }: { className?: string }) {
    const leftEyeRef = useRef<HTMLDivElement>(null);
    const rightEyeRef = useRef<HTMLDivElement>(null);
    const [leftPupil, setLeftPupil] = useState<Pupil>({ x: 0, y: 0 });
    const [rightPupil, setRightPupil] = useState<Pupil>({ x: 0, y: 0 });
    const [blink, setBlink] = useState(false);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            // Use window.innerWidth/Height to avoid jitter if needed, but clientX/Y is fine
            setLeftPupil(getPupilOffset(leftEyeRef.current, e.clientX, e.clientY, 3)); // smaller radius for tighter sockets
            setRightPupil(getPupilOffset(rightEyeRef.current, e.clientX, e.clientY, 3));
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    // Random blink every 2–6 s
    useEffect(() => {
        const schedule = () => {
            const delay = 2000 + Math.random() * 4000;
            const t = setTimeout(() => {
                setBlink(true);
                setTimeout(() => {
                    setBlink(false);
                    schedule();
                }, 120);
            }, delay);
            return t;
        };
        const t = schedule();
        return () => clearTimeout(t);
    }, []);

    return (
        <div
            className={`flex items-center select-none ${className}`}
            title="Hello! I follow your mouse."
            aria-hidden="true"
        >
            {/* Robot Head - Matching the grey mask/avatar from screenshot */}
            <div className="relative w-9 h-8 rounded-lg bg-[#b4b8c2] border-2 border-[#8e94a5] flex items-center justify-center gap-[3px] p-1 shadow-md group-hover:scale-110 transition-transform">
                {/* Top "Bump" for more robot look */}
                <div className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-6 h-[4px] bg-[#b4b8c2] border-t-2 border-l-2 border-r-2 border-[#8e94a5] rounded-t-lg" />

                {/* Left eye socket (dark grey/black goggle look) */}
                <div
                    ref={leftEyeRef}
                    className="relative w-[11px] h-[14px] rounded-[4px] bg-[#1a1c23] border border-[#444] overflow-hidden flex items-center justify-center"
                >
                    {blink ? (
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/40 mt-[6px]" />
                    ) : (
                        <div
                            className="absolute w-[5px] h-[5px] rounded-full bg-primary"
                            style={{
                                transform: `translate(${leftPupil.x}px, ${leftPupil.y}px)`,
                                transition: "transform 0.08s ease-out",
                                boxShadow: "0 0 6px rgba(15,190,210,0.8)",
                            }}
                        />
                    )}
                </div>

                {/* Right eye socket */}
                <div
                    ref={rightEyeRef}
                    className="relative w-[11px] h-[14px] rounded-[4px] bg-[#1a1c23] border border-[#444] overflow-hidden flex items-center justify-center"
                >
                    {blink ? (
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/40 mt-[6px]" />
                    ) : (
                        <div
                            className="absolute w-[5px] h-[5px] rounded-full bg-primary"
                            style={{
                                transform: `translate(${rightPupil.x}px, ${rightPupil.y}px)`,
                                transition: "transform 0.08s ease-out",
                                boxShadow: "0 0 6px rgba(15,190,210,0.8)",
                            }}
                        />
                    )}
                </div>

                {/* Mouth/Teeth (matching the small vertical lines in screenshot) */}
                <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 flex gap-[2px]">
                    <div className="w-[2px] h-[4px] bg-[#444] rounded-full opacity-40" />
                    <div className="w-[2px] h-[4px] bg-[#444] rounded-full opacity-40" />
                </div>

                {/* Antenna (subtle) */}
                <div className="absolute -top-1.5 right-[6px] w-[1px] h-[3px] bg-[#8e94a5]" />
                <div className="absolute -top-2 right-[5px] w-[3px] h-[3px] rounded-full bg-primary" />
            </div>
        </div>
    );
}
