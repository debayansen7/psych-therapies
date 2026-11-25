import { site } from "@/content";
import s from "./SiteFooter.module.css";

/** Transparent credit bar at the foot of the page. */
export function SiteFooter() {
  return (
    <footer className={s.footer}>
      <p>{site.footer.credit}</p>
    </footer>
  );
}
