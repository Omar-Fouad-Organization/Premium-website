import { useEffect, useState } from 'react';
import { cmsHslColor } from '@/lib/cmsBranding';
import { useSiteSettings } from '@/hooks/useSiteSettings';

// This component belongs only to the public website. ERP never imports it.
export default function PublicCmsBranding() {
  const { settings } = useSiteSettings('colors');
  const [route, setRoute] = useState(window.location.hash);
  useEffect(() => { const update = () => setRoute(window.location.hash); window.addEventListener('hashchange', update); return () => window.removeEventListener('hashchange', update); }, []);
  const [active, setActive] = useState(false);
  useEffect(() => {
    let alive = true;
    fetch('/api/cms-public-config', { credentials: 'omit' }).then(r => r.ok ? r.json() : null).then(data => { if (alive) setActive(data?.branding_enabled === true); }).catch(() => {});
    return () => { alive = false; };
  }, []);
  useEffect(() => {
    if (!active || route.startsWith('#/admin')) return;
    const original = new Map<string, string>();
    const mapping: Record<string, string> = {color_primary:'primary', primary_color:'primary', color_secondary:'secondary', secondary_color:'secondary', color_accent:'accent', accent_color:'accent', color_background:'background', background_color:'background', text_color:'foreground', muted_color:'muted'};
    for (const [key, variable] of Object.entries(mapping)) {
      const value = cmsHslColor(settings[key]);
      if (!value) continue;
      const name = '--' + variable;
      if (!original.has(name)) original.set(name, document.documentElement.style.getPropertyValue(name));
      document.documentElement.style.setProperty(name, value);
    }
    return () => { original.forEach((value, name) => value ? document.documentElement.style.setProperty(name, value) : document.documentElement.style.removeProperty(name)); };
  }, [active, settings, route]);
  return null;
}
