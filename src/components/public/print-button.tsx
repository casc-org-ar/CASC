"use client";

import { Printer, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Triggers the browser print dialog for the current page. Print styles
 * (see the `print:` utilities on the page) hide the chrome so only the
 * document body prints — the user can also "Save as PDF" from that dialog.
 * Hidden when printing so it never appears in the output.
 */
export function PrintButton({ label = "Imprimir" }: { label?: string }) {
  return (
    <Button
      type="button"
      variant="primary"
      size="lg"
      onClick={() => window.print()}
      className="print:hidden"
    >
      <Printer className="h-4 w-4" aria-hidden />
      {label}
      <ArrowRight
        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
        aria-hidden
      />
    </Button>
  );
}
