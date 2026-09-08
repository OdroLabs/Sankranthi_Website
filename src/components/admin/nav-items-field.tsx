"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
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
 *
 * Dragging is done with plain pointer events rather than a layout-animation
 * library: this field lives inside a settings tab that starts off
 * `display: none` (every tab stays mounted so its values submit with the
 * rest of the form — see settings-form.tsx), and libraries that cache each
 * row's measured position can end up dragging against stale 0x0 geometry
 * from before the tab was ever shown. Measuring the rows fresh from the DOM
 * on every pointer move sidesteps that entirely.
 */
export function NavItemsField({ name, defaultValue }: { name: string; defaultValue: string }) {
  const [items, setItems] = useState<NavItemState[]>(() => parseNavItemStates(defaultValue));
  const [draggingKey, setDraggingKey] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<string | null>(null);

  const toggle = (key: string) => {
    setItems((current) =>
      current.map((item) => (item.key === key ? { ...item, on: !item.on } : item))
    );
  };

  const startDrag = (key: string) => (e: ReactPointerEvent<HTMLButtonElement>) => {
    // Stops the browser's own native drag/text-selection gesture from
    // hijacking the pointer before our own move/up handlers see it.
    e.preventDefault();
    draggingRef.current = key;
    setDraggingKey(key);

    const onMove = (moveEvent: PointerEvent) => {
      const dragging = draggingRef.current;
      const container = listRef.current;
      if (!dragging || !container) return;

      const rows = Array.from(
        container.querySelectorAll<HTMLElement>("[data-nav-item-key]")
      );
      const overRow = rows.find((row) => {
        const rect = row.getBoundingClientRect();
        return moveEvent.clientY >= rect.top && moveEvent.clientY <= rect.bottom;
      });
      const overKey = overRow?.dataset.navItemKey;
      if (!overKey || overKey === dragging) return;

      setItems((current) => {
        const fromIndex = current.findIndex((item) => item.key === dragging);
        const toIndex = current.findIndex((item) => item.key === overKey);
        if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return current;
        const next = current.slice();
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        return next;
      });
    };

    const endDrag = () => {
      draggingRef.current = null;
      setDraggingKey(null);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
  };

  return (
    <div>
      <input type="hidden" name={name} value={serializeNavItemStates(items)} />
      <div ref={listRef} className="space-y-2">
        {items.map((item) => (
          <div
            key={item.key}
            data-nav-item-key={item.key}
            className={cn(
              "flex items-center gap-2 rounded-lg border bg-muted/30 transition-shadow",
              draggingKey === item.key && "shadow-md ring-1 ring-ring"
            )}
          >
            <button
              type="button"
              draggable={false}
              onPointerDown={startDrag(item.key)}
              aria-label={`Drag to reorder ${labelFor(item.key)}`}
              className="flex h-full shrink-0 cursor-grab touch-none select-none items-center px-2.5 py-3 text-muted-foreground/60 hover:text-muted-foreground active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <div className="flex flex-1 items-center justify-between gap-4 py-3 pr-4">
              <p className="text-sm font-medium">{labelFor(item.key)}</p>
              <button
                type="button"
                role="switch"
                aria-checked={item.on}
                aria-label={labelFor(item.key)}
                onClick={() => toggle(item.key)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  item.on ? "bg-primary" : "bg-input"
                )}
              >
                <span
                  className={cn(
                    "block h-4 w-4 rounded-full bg-white shadow transition-transform",
                    item.on ? "translate-x-[1.125rem]" : "translate-x-0.5"
                  )}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
