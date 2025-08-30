"use client";

import { ReactNode, useState } from "react";
import DualViewButton, { ViewType } from "./DualViewButton";

interface DualViewProps {
  views: {
    type: ViewType;
    content: ReactNode;
  }[];
}

export default function DualView({ views }: DualViewProps) {
  const [selectedView, setSelectedView] = useState<ViewType>("list");

  return (
    <section>
      <div className="flex justify-end">
        <DualViewButton view={selectedView} setView={setSelectedView} />
      </div>
      {views.filter(v => selectedView === v.type).map(({ type, content }) => (
        <div key={type} className="transition-all ease-in-out duration-300 my-4">
          {content}
        </div>
      ))}
    </section>
  );
}
