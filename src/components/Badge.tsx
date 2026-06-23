interface BadgeProps {
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
}

export default function Badge({ isVegetarian, isVegan, isGlutenFree }: BadgeProps) {
  return (
    <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
      {isVegan && (
        <span className="badge badge-vegan">Vegan</span>
      )}
      {!isVegan && isVegetarian && (
        <span className="badge badge-veg">Veg</span>
      )}
      {isGlutenFree && (
        <span className="badge badge-gf">GF</span>
      )}
    </div>
  );
}
