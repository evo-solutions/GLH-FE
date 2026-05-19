"use client";

export function SectionHead({ title }: { title: string }) {
  return (
    <div className="gl-section-head">
      <h2>{title}</h2>
    </div>
  );
}
