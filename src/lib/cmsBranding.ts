export function cmsHslColor(value: string | undefined): string | null {
  if (!value) return null;
  const hsl = value.match(/^(\d{1,3}(?:\.\d+)?)\s+(\d{1,3}(?:\.\d+)?)%\s+(\d{1,3}(?:\.\d+)?)%$/);
  if (hsl) return +hsl[1] <= 360 && +hsl[2] <= 100 && +hsl[3] <= 100 ? value : null;
  if (!/^#[a-f0-9]{3}(?:[a-f0-9]{3})?$/i.test(value)) return null;
  let hex = value.slice(1); if (hex.length === 3) hex = [...hex].map(c => c + c).join('');
  const [r,g,b] = [0,2,4].map(offset => parseInt(hex.slice(offset, offset + 2),16)/255);
  const max=Math.max(r,g,b),min=Math.min(r,g,b),delta=max-min,l=(max+min)/2;
  const saturation=delta===0?0:delta/(1-Math.abs(2*l-1));
  let hue=delta===0?0:max===r?((g-b)/delta)%6:max===g?(b-r)/delta+2:(r-g)/delta+4;
  hue=(hue*60+360)%360;
  return hue.toFixed(2)+' '+(saturation*100).toFixed(2)+'% '+(l*100).toFixed(2)+'%';
}
