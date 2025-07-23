import Link from "next/link";
import T from "./TranslatedWord";

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
  {
    label: "Languages",
    href: "admin/languages",
  },
];

export default function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        {navLinks.map((n, key) => (
          <li key={key}>
            <Link href={`/${n.href}`} title={n.title}>
              <T>{n.label}</T>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
