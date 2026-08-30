import type { ReactNode } from "react";

type EditorialLabelProps = {
  children: ReactNode;
};

export function EditorialLabel({ children }: EditorialLabelProps) {
  return <p className="editorial-label">{children}</p>;
}
