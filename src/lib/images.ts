// Centralized image URLs so they're easy to swap later.
// All sources are high-quality Unsplash photos with consistent beauty-salon framing.

export const heroImages = {
  primary:
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80',
  // Soft secondary used in floating frame
  secondary:
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
  // Tone-on-tone product still life
  tertiary:
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1200&q=80',
};

export const aboutImages = {
  studio:
    'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&w=1400&q=80',
  consultation:
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80',
};

// Niche-specific service fallback images, keyed by lowercased keywords found in service names.
// Used when a service doesn't have its own image attached in the database.
export const serviceImageMap: { keyword: string; url: string; alt: string }[] = [
  {
    keyword: 'facial',
    url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80',
    alt: 'Calm signature facial treatment in an elegant treatment room',
  },
  {
    keyword: 'makeup',
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
    alt: 'Makeup artist applying soft glam look to a client',
  },
  {
    keyword: 'brow',
    url: 'https://images.unsplash.com/photo-1583241800698-9c2e6b7f6f7e?auto=format&fit=crop&w=1200&q=80',
    alt: 'Refined brow shaping in a premium beauty studio',
  },
  {
    keyword: 'lash',
    url: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=1200&q=80',
    alt: 'Elegant lash detail and beauty tools',
  },
  {
    keyword: 'hair',
    url: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=1200&q=80',
    alt: 'Polished hair styling moment in a modern salon',
  },
  {
    keyword: 'bridal',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    alt: 'Elegant bridal beauty consultation atmosphere',
  },
  {
    keyword: 'consult',
    url: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=1200&q=80',
    alt: 'Soft beauty consultation in a refined salon space',
  },
  {
    keyword: 'skin',
    url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
    alt: 'Skincare ritual with premium products',
  },
  {
    keyword: 'massage',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    alt: 'Soothing massage treatment in a calm studio',
  },
];

// Generic fallback when no keyword matches.
export const genericServiceImage =
  'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80';

export function imageForService(name: string | null | undefined): {
  url: string;
  alt: string;
} {
  const lower = (name || '').toLowerCase();
  const match = serviceImageMap.find((entry) => lower.includes(entry.keyword));
  if (match) return { url: match.url, alt: match.alt };
  return { url: genericServiceImage, alt: 'Premium beauty service moment' };
}
