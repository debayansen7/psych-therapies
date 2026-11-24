import { site } from "@/content";
import s from "./SiteFooter.module.css";

/** Transparent credit bar. `overlay` pins it to the bottom of the home viewport. */
export function SiteFooter({ overlay = false }: { overlay?: boolean }) {
  return (
    <footer className={`${s.footer} ${overlay ? s.overlay : ""}`}>
      <p>{site.footer.credit}</p>
    </footer>
  );
}
