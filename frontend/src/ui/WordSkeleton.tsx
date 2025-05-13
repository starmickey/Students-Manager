interface WordSkeletonProps {
  color?: string;
  height?: "sm" | "base" | "dialog-title";
  width?: "sm" | "base"
}

const heightMap = {
  sm: "0.65rem",
  base: "0.95rem",
  "dialog-title": "1.98rem"
}

const widthMap = {
  sm: "3rem",
  base: "7rem"
}

export default function WordSkeleton({ color = "#ccccd7", height = "base", width ="base" }: WordSkeletonProps) {
  const styles = {
    backgroundColor: color,
    height: heightMap[height],
    width: widthMap[width],
    marginBottom: "0.25rem",
    marginTop: "0.25rem",
    borderRadius: "10px",
  }
  
  return <div style={styles} className="w-32 animate-pulse"></div>;
}
