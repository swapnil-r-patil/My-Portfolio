import { motion } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";
import EditableText from "./admin/EditableText";
import EditableList from "./admin/EditableList";
import { Plus, Trash2 } from "lucide-react";

const SkillsSection = () => {
  const { skills, setSkills, isAdmin } = useAdmin();

  const addGroup = () => {
    setSkills([...skills, { title: "New Group", skills: [] }]);
  };

  const removeGroup = (gi: number) => {
    setSkills(skills.filter((_, i) => i !== gi));
  };

  return (
    <section id="skills" className="section-padding relative">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <p className="text-primary text-sm font-medium tracking-[0.2em] uppercase mb-3">Skills</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground">
            Technologies I{" "}<span className="gradient-text">work with</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {skills.map((group, gi) => (
            <motion.div
              key={gi}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: gi * 0.1, duration: 0.5 }}
              className="glass-card rounded-2xl p-6 relative group/group"
            >
              {isAdmin && (
                <button
                  onClick={() => removeGroup(gi)}
                  className="absolute top-3 right-3 opacity-0 group-hover/group:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                  title="Remove group"
                >
                  <Trash2 size={14} />
                </button>
              )}
              <h3 className="font-display font-semibold text-foreground mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <EditableText
                  value={group.title}
                  onChange={(v) => {
                    const updated = [...skills];
                    updated[gi] = { ...updated[gi], title: v };
                    setSkills(updated);
                  }}
                  as="span"
                />
              </h3>
              <EditableList
                items={group.skills}
                onChange={(items) => {
                  const updated = [...skills];
                  updated[gi] = { ...updated[gi], skills: items };
                  setSkills(updated);
                }}
                itemClassName="px-4 py-2 rounded-lg bg-muted text-sm text-foreground font-medium cursor-default transition-colors hover:bg-primary/10 hover:text-primary"
                label="skill"
              />
            </motion.div>
          ))}
        </div>

        {isAdmin && (
          <div className="mt-6 text-center">
            <button
              onClick={addGroup}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-primary/40 text-primary/70 hover:border-primary hover:text-primary text-sm transition-all"
            >
              <Plus size={14} /> Add Skill Group
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
