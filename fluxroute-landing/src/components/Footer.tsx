import { Github, Twitter } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/Logo";

const GITHUB_URL = "https://github.com/FluxRouteOfficial/FluxRoute";
const X_URL = "https://x.com/FluxRoutexyz";
const CONTACT_EMAIL = "hello@fluxroute.xyz";

type FooterLink = { label: string; href: string; external?: boolean };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Service registry", href: "/#services" },
      { label: "Developers", href: "/#developers" },
      { label: "Docs", href: "/docs" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Quick start", href: "/docs#quickstart" },
      { label: "Provider SDK", href: "/docs#provider-sdk" },
      { label: "Source on GitHub", href: GITHUB_URL, external: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: `mailto:${CONTACT_EMAIL}` },
      { label: "GitHub", href: GITHUB_URL, external: true },
      { label: "X (Twitter)", href: X_URL, external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Security", href: "/privacy#security" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-panel/40">
      <Container>
        <div className="grid gap-10 py-16 md:grid-cols-[1.5fr_repeat(4,1fr)]">
          {/* Brand block */}
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-body-sm text-dim">
              The Solana-native AI microservice routing layer. One connection,
              every service.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href={X_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FluxRoute on X"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-dim transition-colors hover:border-line-strong hover:text-ink"
              >
                <Twitter size={16} />
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FluxRoute on GitHub"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-dim transition-colors hover:border-line-strong hover:text-ink"
              >
                <Github size={16} />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-body-sm font-semibold text-ink">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-body-sm text-faint transition-colors hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-line py-8 md:flex-row md:items-center">
          <p className="text-body-sm text-faint">(c) 2026 FluxRoute. Built on Solana.</p>
          <span className="inline-flex items-center gap-2 text-body-sm text-dim">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            Production domains live
          </span>
        </div>
      </Container>
    </footer>
  );
}
