import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Plus, Trash2, Pencil, X, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import type { ProjectItem } from "@/context/AdminContext";

const emptyProject = (): ProjectItem => ({
  title: "New Project",
  description: "Project description...",
  tech: ["React"],
  featured: false,
  github: "#",
  live: "#",
  images: [],
  showImage: false,
  screenshotCount: 3,
});

const ProjectEditDialog = ({
  project,
  onSave,
  onClose,
}: {
  project: ProjectItem;
  onSave: (p: ProjectItem) => void;
  onClose: () => void;
}) => {
  const [draft, setDraft] = useState({ ...project });
  const [techInput, setTechInput] = useState("");
  const [imageInput, setImageInput] = useState("");

  const addTech = () => {
    if (techInput.trim()) { setDraft({ ...draft, tech: [...draft.tech, techInput.trim()] }); setTechInput(""); }
  };
  const removeTech = (i: number) => setDraft({ ...draft, tech: draft.tech.filter((_, idx) => idx !== i) });

  const addImage = () => {
    if (imageInput.trim()) {
      setDraft({ ...draft, images: [...(draft.images || []), imageInput.trim()] });
      setImageInput("");
    }
  };
  const removeImage = (i: number) => setDraft({ ...draft, images: (draft.images || []).filter((_, idx) => idx !== i) });

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={18} /></button>
        <h3 className="font-display font-bold text-lg mb-4">Edit Project</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Title</label>
            <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Description</label>
            <textarea value={draft.description} rows={3} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">GitHub URL</label>
            <input value={draft.github} onChange={(e) => setDraft({ ...draft, github: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Live URL</label>
            <input value={draft.live} onChange={(e) => setDraft({ ...draft, live: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Screenshot URLs (Optional - defaults to auto-live)</label>
            <div className="flex flex-col gap-2 mt-1">
              {(draft.images || []).map((img, i) => (
                <div key={i} className="flex items-center gap-2 group">
                  <div className="flex-1 px-3 py-1.5 rounded-lg bg-muted border border-border text-xs truncate">{img}</div>
                  <button onClick={() => removeImage(i)} className="text-red-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                  placeholder="Paste image URL..."
                  className="flex-1 px-3 py-1.5 rounded-lg bg-muted border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
                  id="image-url-input"
                />
                <button onClick={addImage} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs hover:bg-primary/20"><Plus size={14} /></button>
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Screenshot Count ({draft.images?.length && draft.images.length > 0 ? "Manual limit" : "Auto views"})</label>
            <input
              type="number"
              min={1}
              max={5}
              value={draft.screenshotCount || 1}
              onChange={(e) => setDraft({ ...draft, screenshotCount: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured" checked={draft.featured} onChange={(e) => setDraft({ ...draft, featured: e.target.checked })} />
              <label htmlFor="featured" className="text-xs text-muted-foreground">Featured</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="showImage" checked={draft.showImage} onChange={(e) => setDraft({ ...draft, showImage: e.target.checked })} />
              <label htmlFor="showImage" className="text-xs text-muted-foreground">Show Preview Button</label>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Tech Stack</label>
            <div className="flex flex-wrap gap-2 mt-1 mb-2">
              {draft.tech.map((t, i) => (
                <span key={i} className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                  {t} <button onClick={() => removeTech(i)}><X size={10} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())} placeholder="Add tech..." className="flex-1 px-3 py-1.5 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <button onClick={addTech} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm hover:bg-primary/20"><Plus size={14} /></button>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          <button onClick={() => { onSave(draft); onClose(); }} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-1"><Check size={14} /> Save</button>
        </div>
      </motion.div>
    </div>
  );
};

const ProjectCard = ({ project, isAdmin, onEdit, onRemove, index }: { project: ProjectItem; isAdmin: boolean; onEdit: () => void; onRemove: () => void; index: number }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  const getAutoScreenshots = () => {
    const live = project.live || "#";
    const count = project.screenshotCount || 1;
    const base = `https://api.microlink.io/?url=`;
    const suffix = `&screenshot=true&meta=false&embed=screenshot.url&waitForTimeout=8000`;

    // Configuration for different pages/views
    const configuration = [
      { path: "", viewport: "" }, // Home
      { path: "/about", viewport: "" }, // About
      { path: "/contact", viewport: "" }, // Contact
      { path: "", viewport: "&viewport.isMobile=true&viewport.width=375&viewport.height=667" }, // Home Mobile
      { path: "/projects", viewport: "" }, // Projects
    ];

    return Array.from({ length: Math.min(count, configuration.length) }).map((_, i) => {
      const config = configuration[i];
      const targetUrl = encodeURIComponent(`${live.replace(/\/$/, '')}${config.path}`);
      return `${base}${targetUrl}${suffix}${config.viewport}`;
    });
  };

  const images = (project.images && project.images.length > 0)
    ? project.images.slice(0, project.screenshotCount || project.images.length)
    : getAutoScreenshots();

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev + 1) % images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className={`glass-card-hover rounded-2xl overflow-hidden group relative ${project.featured ? "md:col-span-2" : ""}`}
    >
      {isAdmin && (
        <div className="absolute top-3 right-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="w-7 h-7 rounded-full bg-primary/20 hover:bg-primary/40 flex items-center justify-center text-primary"><Pencil size={12} /></button>
          <button onClick={onRemove} className="w-7 h-7 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400"><Trash2 size={12} /></button>
        </div>
      )}
      <div className="h-1 w-full bg-gradient-to-r from-primary to-secondary" />
      <div className={`p-6 md:p-8 ${project.featured ? "md:flex md:gap-8 md:items-center" : ""}`}>
        <div className="flex-1">
          <h3 className="font-display font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-5">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {project.tech.map((t) => (
              <span key={t} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">{t}</span>
            ))}
          </div>

          <AnimatePresence>
            {showPreview && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-5"
              >
                <div className="rounded-xl overflow-hidden border border-border/50 aspect-video relative group/img max-w-full bg-black/20">
                  <img
                    src={images[currentImgIdx]}
                    alt={`${project.title} - Preview ${currentImgIdx + 1}`}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                  {images.length > 1 && (
                    <>
                      <button onClick={prevImg} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/80 transition-all z-10 scale-90 active:scale-75 shadow-lg">
                        <ChevronLeft size={16} />
                      </button>
                      <button onClick={nextImg} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/80 transition-all z-10 scale-90 active:scale-75 shadow-lg">
                        <ChevronRight size={16} />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {images.map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImgIdx ? "bg-primary w-3" : "bg-white/50"}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/60 to-transparent p-3">
                    <p className="text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      Project Preview {images.length > 1 ? `(${currentImgIdx + 1}/${images.length})` : ""}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-4">
            <a href={project.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-foreground hover:text-primary transition-colors font-medium"><ExternalLink size={14} />Live Demo</a>
            {project.showImage && (
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`inline-flex items-center gap-1.5 text-sm transition-colors font-medium ${showPreview ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <div className="relative">
                  <Pencil size={14} className={showPreview ? "rotate-45" : ""} />
                  {images.length > 1 && !showPreview && (
                    <span className="absolute -top-2 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] text-primary-foreground font-bold border border-background">
                      {images.length}
                    </span>
                  )}
                </div>
                {showPreview ? "Hide Preview" : `Show Preview${images.length > 1 ? `s` : ""}`}
              </button>
            )}
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"><Github size={14} />Source</a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const { projects, setProjects, isAdmin } = useAdmin();
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  const saveProject = (updated: ProjectItem, idx: number) => {
    const list = [...projects];
    list[idx] = updated;
    setProjects(list);
  };

  const removeProject = (idx: number) => setProjects(projects.filter((_, i) => i !== idx));
  const addProject = () => { setProjects([...projects, emptyProject()]); setEditingIdx(projects.length); };

  return (
    <section id="projects" className="section-padding relative">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 flex items-end justify-between">
          <div>
            <p className="text-primary text-sm font-medium tracking-[0.2em] uppercase mb-3">Projects</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground">Featured{" "}<span className="gradient-text">work</span></h2>
          </div>
          {isAdmin && (
            <button onClick={addProject} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-sm transition-all">
              <Plus size={14} /> Add Project
            </button>
          )}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectCard
              key={i}
              index={i}
              project={project}
              isAdmin={isAdmin}
              onEdit={() => setEditingIdx(i)}
              onRemove={() => removeProject(i)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {editingIdx !== null && (
          <ProjectEditDialog
            project={projects[editingIdx]}
            onSave={(p) => saveProject(p, editingIdx)}
            onClose={() => setEditingIdx(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProjectsSection;
