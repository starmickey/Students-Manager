import { ReactNode } from "react";
import { MdOutlineFormatListBulleted as ListIcon } from "react-icons/md";
import { MdOutlineGridView as GridIcon } from "react-icons/md";
import { MdCheck as Check } from "react-icons/md";

export type ViewType = "list" | "grid";

interface View {
  viewType: ViewType;
  icon: ReactNode;
}

const views: View[] = [
  {
    viewType: "list",
    icon: <ListIcon />,
  },
  {
    viewType: "grid",
    icon: <GridIcon />,
  },
];

export default function DualViewButton({
  className = "",
  view,
  setView,
}: {
  className?: string;
  view: ViewType;
  setView: (view: ViewType) => void;
}) {
  return (
    <div className={`flex ${className}`}>
      {views.map(({ viewType, icon }, index) => (
        <button
          key={viewType}
          className={`
            flex items-center justify-center gap-1 w-12
            border border-primary p-1 transition-all duration-100 ease-in-out
            ${ index === 0 && "rounded-l-full"}
            ${index === views.length - 1 && "rounded-r-full"}
            ${view === viewType ? "bg-primary text-white" : "hover:bg-primary-hover hover:text-white hover:border-primary-hover"}
          `}
          disabled={view === viewType}
          onClick={() => setView(viewType)}
        >
          {view === viewType && <Check size={14} />}
          {icon}
        </button>
      ))}
    </div>
  );
}
