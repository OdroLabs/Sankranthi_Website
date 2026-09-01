"use client";

import { useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NAV_ITEM_CATALOG,
  parseNavItemStates,
  serializeNavItemStates,
  type NavItemState,
} from "@/lib/nav-catalog";

function labelFor(key: string): string {
  return NAV_ITEM_CATALOG.find((item) => item.key === key)?.label ?? key;
}

function Row({
  state,
  onToggle,
}: {
  state: NavItemState;
  onToggle: () => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={state}
      dragListener={false}
      dragControls={controls}
      className="flex items-center gap-2 rounded-lg border bg-muted/30"
    >
      <button
        type="button"
        onPointerDown={(e) => controls.start(e)}
        aria-label={`Drag to reorder ${labelFor(state.key)}`}
        className="flex h-full shrink-0 cursor-grab touch-none items-center px-2.5 py-3 text-muted-foreground/60 hover:text-muted-foreground active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex flex-1 items-center justify-between gap-4 py-3 pr-4">
        <p className="text-sm font-medium">{labelFor(state.key)}</p>
        <button
          type="button"
          role="switch"
          aria-checked={state.on}
          aria-label={labelFor(state.key)}
          onClick={onToggle}
          className={cn(
            "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            state.on ? "bg-primary" : "bg-input"
          )}
        >
          <span
            className={cn(
              "block h-4 w-4 rounded-full bg-white shadow transition-transform",
              state.on ? "translate-x-[1.125rem]" : "translate-x-0.5"
            )}
          />
        </button>
      </div>
    </Reorder.Item>
  );
}

/**
 * The "Menu items" list under Site Settings -> Header & Navigation. Each row
 * is on/off (same as any other toggle in this form) and drag-to-reorder; the
 * order posted here is the order used in the header, mobile menu and footer
 * everywhere that item appears (see `buildNav` in lib/nav.ts).
 *
 * Order + on/off both live in one posted value, one line per item:
 * "about:on\nprojects:off\n...". `defaultValue` is already fully resolved
 * server-side (including the one-time fallback to the legacy nav_show_*
 * switches), so this component only ever needs to parse and re-serialize it.
 */
export function NavItemsField({ name, defaultValue }: { name: string; defaultValue: string }) {
  const [items, setItems] = useState<NavItemState[]>(() => parseNavItemStates(defaultValue));

  const toggle = (key: string) => {
    setItems((current) =>
      current.map((item) => (item.key === key ? { ...item, on: !item.on } : item))
    );
  };

  return (
    <div>
      <input type="hidden" name={name} value={serializeNavItemStates(items)} />
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className="list-none space-y-2"
      >
        {items.map((item) => (
          <Row key={item.key} state={item} onToggle={() => toggle(item.key)} />
        ))}
      </Reorder.Group>
    </div>
  );
}
