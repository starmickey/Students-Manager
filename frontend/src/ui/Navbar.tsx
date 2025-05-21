import Link from "next/link";
import { TranslatedWordWrapper as T } from "./TranslatedWord";

interface NavLink {
  label: string;
  href: string;
  title?: string;
}

const navLinks: NavLink[] = [
  {
    label: "Translations",
    href: "admin/translations",
  },
];

interface NavbarProps {
  lang: string;
}

export default function Navbar({ lang }: NavbarProps) {
  return (
    <nav className="navbar">
      <ul>
        {navLinks.map((n, key) => (
          <li key={key}>
            <Link href={ `/${lang}/${n.href}`} title={n.title}>
              <T>{n.label}</T>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
