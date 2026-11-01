
import type { ReactNode } from "react";

const sections = ["Dashboard", "Site Settings", "Location & Map", "SEO Settings", "Logo & Branding", "Design & Colors", "Page Content", "Photo Management", "Packages", "FAQs", "Blog Management", "Submissions", "User Management", "Partners Management", "Language & Translations"];

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <aside className="bg-primary text-white p-6 lg:w-64 lg:shrink-0">
        <h2 className="text-2xl font-bold">Premium Admin</h2>
        <p className="text-sm text-white/70 mt-1 mb-6">Green Life Expo · Demo</p>
        <nav aria-label="Demo navigation" className="space-y-1">
          {sections.map((section, index) => (
            <div key={section} className={`px-3 py-2 rounded-lg ${index === 0 ? "bg-white/20 font-semibold" : "text-white/60"}`}>
              {section}{index !== 0 && <span className="sr-only"> (preview only)</span>}
            </div>
          ))}
        </nav>
        <a href="/" className="inline-block mt-6 underline">Back to website</a>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">
        <div role="status" className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950">
          <strong>Local demo — sample data only.</strong> This overview is read-only. Management screens are unavailable here; no live data is loaded or saved.
          <a href="/#/admin/login" onClick={(event) => { event.preventDefault(); window.location.hash = "/admin/login"; window.location.reload(); }} className="block mt-2 underline">Exit demo and sign in</a>
        </div>
        {children}
      </main>
    </div>
  );
}
