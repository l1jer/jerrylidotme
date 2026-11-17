import { ImageResponse } from 'next/og'
import { site } from '../lib/seo'

// The preview card shown when the site is shared (LinkedIn, Slack, X, iMessage, ...).
export const alt = `${site.name} — ${site.jobTitle}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const TAGS = ['WooCommerce & Shopify', 'ERP integration', 'SEO, GEO & AEO', 'AI-assisted engineering']

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          color: '#fff',
          backgroundColor: '#070815',
          backgroundImage:
            'radial-gradient(circle at 82% 18%, rgba(129,140,248,0.55), transparent 46%), radial-gradient(circle at 10% 100%, rgba(236,72,153,0.32), transparent 50%)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, letterSpacing: 6, color: '#a5b4fc' }}>
          <span>PORTFOLIO · CANBERRA, AUSTRALIA</span>
          <span style={{ color: '#fff', fontWeight: 700 }}>JL.</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 150, fontWeight: 700, letterSpacing: -6, lineHeight: 1 }}>{site.name}</div>
          <div style={{ marginTop: 22, fontSize: 46, color: '#c7d2fe' }}>{site.jobTitle}</div>
        </div>
        {/* One plain line: the image renderer mis-measures text inside bordered pills. */}
        <div style={{ display: 'flex', fontSize: 24, color: '#e5e7eb', borderTop: '2px solid rgba(255,255,255,0.18)', paddingTop: 26 }}>
          {TAGS.join('  ·  ')}
        </div>
      </div>
    ),
    size
  )
}
