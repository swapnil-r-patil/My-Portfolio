import { useAdmin } from "@/context/AdminContext";
import EditableText from "./admin/EditableText";

const Footer = () => {
  const { footer, setFooter } = useAdmin();

  return (
    <footer className="border-t border-[hsl(var(--glass-border))] py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()}{" "}
          <EditableText
            value={footer.copyright}
            onChange={(v) => setFooter({ ...footer, copyright: v })}
            as="span"
            className="text-sm text-muted-foreground"
          />
        </p>
        <p className="text-xs text-muted-foreground/50">
          Designed & developed with ❤️
        </p>
      </div>
    </footer>
  );
};

export default Footer;
