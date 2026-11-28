import type React from "react";

export function BlockRow({
  from,
  to,
  className,
  BLOCKS,
}: {
  from: number;
  to: number;
  className: string;
  BLOCKS: {
    id: number;
    bg_hover: string;
  }[];
}) {
  return (
    <div className={`x-grid absolute ${className}`}>
      {BLOCKS.slice(from, to).map((b) => (
        <div
          key={b.id}
          className="fun_colors"
          style={{ "--hover": b.bg_hover } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
