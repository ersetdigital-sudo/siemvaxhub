import { ICON_PATHS, type IconName } from "@/lib/icons";

export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg
      className={`ico ${className}`.trim()}
      viewBox="0 0 24 24"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] }}
    />
  );
}
