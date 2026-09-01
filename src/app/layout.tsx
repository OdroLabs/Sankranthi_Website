import type { Metadata, Viewport } from "next";
import "./globals.css";
import "lenis/dist/lenis.css";
import { PageLoader } from "@/components/site/page-loader";

/**
 * Bare fallback only. The public site's real title, description, favicon and
 * share image come from Site Settings → General and are applied in
 * `src/app/[locale]/layout.tsx`.
 */
export const metadata: Metadata = {
  title: "Sankranthi Foundation",
  description: "Community-led care, opportunity and dignity across Sri Lanka.",
  icons: { icon: "/brand/mark.png" },
};

export const viewport: Viewport = {
  themeColor: "#FFF9F5",
  viewportFit: "cover",
};

/**
 * Adds the `anim` class before first paint so GSAP-animated elements start
 * hidden without a flash — but only when JS runs and the user has not asked
 * for reduced motion. Without JS (or with reduced motion) content stays fully
 * visible.
 *
 * Rendered as a plain <script> in <head> (not next/script) on purpose: a
 * `beforeInteractive` next/script is tracked by React as a hoistable
 * "resource", and any later client-side re-render of the root layout (e.g.
 * a dev Fast Refresh touching an unrelated file) makes React think the
 * script is being newly inserted client-side and log "Encountered a script
 * tag while rendering React component" — it also refuses to (re)run it.
 * A raw <script> tag isn't tracked that way, so it isn't affected by that
 * warning/behavior, and for a synchronous inline snippet like this one, a
 * head <script> already runs before the body paints — the same timing
 * `beforeInteractive` was providing.
 */
const animBootstrap = `try{var p=new URLSearchParams(location.search);if(!p.has("adminPreview")&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("anim")}catch(e){}`;

// Some browser extensions inject this attribute before/during hydration,
// causing noisy SSR/client mismatch warnings in development.
const stripInjectedAttrs = `(function(){try{var attr="bis_skin_checked";var scrub=function(root){if(!root||root.nodeType!==1)return;root.removeAttribute&&root.removeAttribute(attr);if(root.querySelectorAll){var nodes=root.querySelectorAll("["+attr+"]");for(var i=0;i<nodes.length;i++)nodes[i].removeAttribute(attr);}};scrub(document.documentElement);new MutationObserver(function(mutations){for(var i=0;i<mutations.length;i++){var m=mutations[i];if(m.type==="attributes"&&m.attributeName===attr&&m.target&&m.target.nodeType===1){m.target.removeAttribute(attr);}if(m.addedNodes){for(var j=0;j<m.addedNodes.length;j++){scrub(m.addedNodes[j]);}}}}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:[attr]});}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          id="anim-bootstrap"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: animBootstrap }}
        />
        <script
          id="strip-injected-attrs"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: stripInjectedAttrs }}
        />
      </head>
      <body suppressHydrationWarning>
        <PageLoader />
        {children}
      </body>
    </html>
  );
}
