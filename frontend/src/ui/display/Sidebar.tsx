import Link from "next/link";

export type SidebarElement = {
  label: string;
  title: string;
  href: string;
};

interface SidebarProps {
  elements: SidebarElement[];
}

export default function Sidebar({ elements }: SidebarProps) {
  return (
    <nav className="sidebar">
      <ul>
        {elements.map((e, key) => (
          <li key={key} className="sidebar-element mt-16">
            <Link href={e.href} title={e.title}>
              {e.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
