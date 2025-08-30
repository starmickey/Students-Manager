interface CardProps {
  title: string;
  description?: string;
}

export default function Card({ title, description }: CardProps) {
  return (
    <div className="card w-full">
      {/* Image section */}
      <img
        src="/abstract_pattern_design_background_2007.jpg"
        alt="Matemáticas"
        className="card-img h-28"
      />

      {/* Description section */}
      <div className="card-content">
        <h4 className="card-title">{title}</h4>
        {description && (
          <p className="card-description">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
