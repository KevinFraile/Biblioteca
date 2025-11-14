"use client";

import * as React from "react";

// Asumo que 'cn' viene de una ruta estándar como '@/lib/utils'
import { cn } from "./utils"; // Asumo que tienes este helper

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      // CAMBIO: Borde naranja
      className="relative w-full overflow-x-auto rounded-lg border border-orange-200/75 dark:border-orange-800/50"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      // CAMBIO: Fondo naranja pálido (light) y oscuro (dark)
      className={cn("bg-orange-100 dark:bg-orange-900", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      // CAMBIO: Divisores de fila naranjas
      className={cn(
        "divide-y divide-orange-200 dark:divide-orange-800",
        className,
      )}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      // CAMBIO: Borde y fondo naranja
      className={cn(
        "border-t border-orange-200 bg-orange-100/50 dark:border-orange-800 dark:bg-orange-900/50 font-medium",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      // CAMBIO: Hover y selección en tonos naranja
      className={cn(
        "hover:bg-orange-50 dark:hover:bg-orange-950/50 data-[state=selected]:bg-orange-100 dark:data-[state=selected]:bg-orange-900 transition-colors",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      // CAMBIO: Texto del encabezado en naranja oscuro (light) y claro (dark)
      className={cn(
        "h-12 px-4 text-left align-middle font-semibold text-orange-900 dark:text-orange-300 whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      // NOTA: Mantenemos el texto principal oscuro/claro para legibilidad
      className={cn(
        "p-4 align-middle whitespace-nowrap text-gray-800 dark:text-gray-100 [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      // CAMBIO: Texto de la leyenda en naranja
      className={cn("mt-4 text-sm text-orange-600 dark:text-orange-400", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};