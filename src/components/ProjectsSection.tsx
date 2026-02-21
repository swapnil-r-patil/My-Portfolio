import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Plus, Trash2, Pencil, X, Check } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import type { ProjectItem } from "@/context/AdminContext";

const emptyProject = (): ProjectItem => ({
  title: "New Project",
  description: "Project description...",
  tech: ["React"],
  featured: false,
  github: "#",
  live: "#",
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

  const addTech = () => {
    if (techInput.trim()) { setDraft({ ...draft, tech: [...draft.tech, techInput.trim()] }); setTechInput(""); }
  };
  const removeTech = (i: number) => setDraft({ ...draft, tech: draft.tech.filter((_, idx) => idx !== i) });

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
          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" checked={draft.featured} onChange={(e) => setDraft({ ...draft, featured: e.target.checked })} />
            <label htmlFor="featured" className="text-sm text-muted-foreground">Featured (spans 2 columns)</label>
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
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className={`glass-card-hover rounded-2xl overflow-hidden group relative ${project.featured ? "md:col-span-2" : ""}`}
            >
              {isAdmin && (
                <div className="absolute top-3 right-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingIdx(i)} className="w-7 h-7 rounded-full bg-primary/20 hover:bg-primary/40 flex items-center justify-center text-primary"><Pencil size={12} /></button>
                  <button onClick={() => removeProject(i)} className="w-7 h-7 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400"><Trash2 size={12} /></button>
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
                  <div className="flex items-center gap-4">
                    <a href={project.live} className="inline-flex items-center gap-1.5 text-sm text-foreground hover:text-primary transition-colors font-medium"><ExternalLink size={14} />Live Demo</a>
                    <a href={project.github} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"><Github size={14} />Source</a>
                  </div>
                </div>
              </div>
            </motion.div>
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
