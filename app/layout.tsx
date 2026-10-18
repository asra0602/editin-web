import type { Metadata } from 'next';
import { Cormorant_Garamond, Source_Serif_4, Bebas_Neue } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body',
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: '[LOGO STUDIO] : Jasa Desain Feed IG Wisuda & Wedding',
  description: 'Katalog pemesanan tata letak sambungan feed Instagram 4:5 (1080x1350 px), struk invoice resmi, dan pantauan progres pengerjaan klien.',
};

const GLOBAL_STYLES = `
:root {
  --bg-page: #FAF8F5;
  --bg-surface: #FFFFFF;
  --bg-muted: #F0ECE1;
  --text-primary: #18181B;
  --text-secondary: #52525B;
  --border-color: #D6D3CD;
  --border-strong: #71717A;
  --accent: #9A3412;
  --accent-hover: #7C2D12;
  --accent-text: #FFFFFF;
  --status-wait-bg: #FEF3C7;
  --status-wait-text: #92400E;
  --status-work-bg: #DBEAFE;
  --status-work-text: #1E40AF;
  --status-done-bg: #DCFCE7;
  --status-done-text: #166534;
  --danger-bg: #FEE2E2;
  --danger-text: #991B1B;
  --focus-ring: #18181B;
  --radius-xs: 2px;
  --radius-sm: 4px;
  --shadow-modal: 0 16px 40px rgba(24, 24, 27, 0.22);
}

html[data-theme="dark"] {
  --bg-page: #121211;
  --bg-surface: #1C1C1A;
  --bg-muted: #272724;
  --text-primary: #F4F4F0;
  --text-secondary: #A1A1AA;
  --border-color: #3F3F3A;
  --border-strong: #A1A1AA;
  --accent: #F97316;
  --accent-hover: #FB923C;
  --accent-text: #121211;
  --status-wait-bg: #451A03;
  --status-wait-text: #FDE68A;
  --status-work-bg: #172554;
  --status-work-text: #BFDBFE;
  --status-done-bg: #052E16;
  --status-done-text: #BBF7D0;
  --danger-bg: #450A0A;
  --danger-text: #FECACA;
  --focus-ring: #F97316;
  --shadow-modal: 0 16px 40px rgba(0, 0, 0, 0.72);
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-body), Georgia, serif;
  background-color: var(--bg-page);
  color: var(--text-primary);
  line-height: 1.6;
  font-size: clamp(0.9375rem, 0.9rem + 0.2vw, 1.0625rem);
  padding-bottom: 96px;
  overflow-x: hidden;
}

h1, h2, h3 {
  font-family: var(--font-heading), Georgia, serif;
  font-weight: 700;
  letter-spacing: -0.01em;
}

:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

button, input, select, textarea, a {
  font: inherit;
  color: inherit;
}

.sim-banner {
  background-color: var(--bg-muted);
  border-bottom: 1px solid var(--border-color);
  padding: 8px 16px;
  font-size: 0.875rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.sim-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.btn-sim {
  min-height: 44px;
  padding: 6px 12px;
  font-size: 0.8125rem;
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  border-radius: var(--radius-xs);
  cursor: pointer;
}

.btn-sim[aria-pressed="true"] {
  background: var(--text-primary);
  color: var(--bg-surface);
  border-color: var(--text-primary);
  font-weight: 600;
}

.site-header {
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 20;
}

.header-inner {
  max-width: 1240px;
  margin: 0 auto;
  padding: 14px 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.brand-identity {
  display: flex;
  flex-direction: column;
}

.brand-logo {
  font-family: var(--font-display), sans-serif;
  font-size: clamp(1.35rem, 1.2rem + 0.5vw, 1.65rem);
  letter-spacing: 0.04em;
  line-height: 1.1;
}

.brand-sub {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.desktop-nav {
  display: none;
  gap: 8px;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn {
  min-height: 44px;
  min-width: 44px;
  padding: 8px 16px;
  border-radius: var(--radius-xs);
  border: 1px solid var(--border-color);
  background-color: var(--bg-surface);
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.btn:hover {
  border-color: var(--border-strong);
}

.btn:active {
  transform: translateY(1px);
}

.btn-primary {
  background-color: var(--accent);
  color: var(--accent-text);
  border-color: var(--accent);
}

.btn-primary:hover {
  background-color: var(--accent-hover);
  border-color: var(--accent-hover);
}

.btn-nav[aria-current="page"] {
  background-color: var(--text-primary);
  color: var(--bg-surface);
  border-color: var(--text-primary);
}

.cart-badge {
  font-family: var(--font-display), sans-serif;
  letter-spacing: 0.04em;
  background-color: var(--bg-surface);
  color: var(--text-primary);
  padding: 2px 8px;
  border-radius: var(--radius-xs);
  font-size: 0.9375rem;
  border: 1px solid var(--border-color);
}

.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: clamp(20px, 3.5vw, 40px) 16px;
}

.section-header {
  margin-bottom: 28px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 18px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
}

.section-title {
  font-size: clamp(1.65rem, 1.4rem + 1vw, 2.35rem);
  line-height: 1.15;
}

.section-desc {
  color: var(--text-secondary);
  max-width: 64ch;
  margin-top: 6px;
}

.pricing-ledger {
  background-color: var(--bg-muted);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 16px 20px;
  margin-bottom: 28px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
}

.pricing-rate {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.rate-amount {
  font-family: var(--font-display), sans-serif;
  font-size: 1.35rem;
  letter-spacing: 0.03em;
  color: var(--accent);
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.catalogue-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

.card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: clamp(18px, 2.2vw, 24px);
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 12px;
}

.tag {
  font-family: var(--font-display), sans-serif;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  padding: 2px 10px;
  border-radius: var(--radius-xs);
  border: 1px solid var(--border-color);
  background-color: var(--bg-muted);
}

.status-wait {
  background-color: var(--status-wait-bg);
  color: var(--status-wait-text);
  border-color: var(--status-wait-text);
}

.status-work {
  background-color: var(--status-work-bg);
  color: var(--status-work-text);
  border-color: var(--status-work-text);
}

.status-done {
  background-color: var(--status-done-bg);
  color: var(--status-done-text);
  border-color: var(--status-done-text);
}

.ig-grid-wrapper {
  background-color: var(--bg-muted);
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xs);
}

.ig-grid-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.ig-grid-preview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;
}

.ig-cell {
  aspect-ratio: 4 / 5;
  background-color: var(--bg-surface);
  border: 1px dashed var(--border-strong);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6px;
  text-align: center;
  font-family: var(--font-display), sans-serif;
  letter-spacing: 0.03em;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.ig-cell.joined-banner {
  background-color: var(--bg-muted);
  border-style: solid;
  border-color: var(--text-primary);
  color: var(--text-primary);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
}

.form-control {
  min-height: 44px;
  padding: 8px 12px;
  border-radius: var(--radius-xs);
  border: 1px solid var(--border-strong);
  background-color: var(--bg-surface);
  color: var(--text-primary);
  width: 100%;
}

.qty-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.qty-controls {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.qty-input {
  width: 72px;
  text-align: center;
  font-family: var(--font-display), sans-serif;
  font-size: 1.125rem;
}

.price-summary-box {
  background-color: var(--bg-muted);
  padding: 12px 14px;
  border-radius: var(--radius-xs);
  border: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.display-price {
  font-family: var(--font-display), sans-serif;
  font-size: 1.35rem;
  letter-spacing: 0.03em;
}

.state-box {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 36px 24px;
  text-align: center;
  max-width: 560px;
  margin: 24px auto;
}

.state-box.error {
  border-color: var(--danger-text);
  background-color: var(--danger-bg);
  color: var(--danger-text);
}

.state-title {
  font-size: 1.35rem;
  margin-bottom: 8px;
}

.state-desc {
  color: var(--text-secondary);
  margin-bottom: 18px;
}

.state-box.error .state-desc {
  color: var(--danger-text);
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(18, 18, 17, 0.65);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  overflow-y: auto;
}

.modal-panel {
  background-color: var(--bg-surface);
  border: 2px solid var(--text-primary);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-modal);
  width: 100%;
  max-width: 700px;
  max-height: 90dvh;
  overflow-y: auto;
  padding: clamp(18px, 3vw, 28px);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 12px;
}

.cart-item {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xs);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
}

.cart-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.cart-item-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.split-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

.invoice-paper {
  background-color: var(--bg-surface);
  border: 2px solid var(--text-primary);
  border-radius: var(--radius-xs);
  padding: clamp(18px, 3vw, 28px);
}

.invoice-header {
  border-bottom: 2px dashed var(--border-strong);
  padding-bottom: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
}

.invoice-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.9375rem;
}

.invoice-total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-top: 16px;
  margin-top: 8px;
  border-top: 2px solid var(--text-primary);
  font-weight: 700;
  font-size: 1.125rem;
}

.progress-steps {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin: 12px 0;
}

.step-item {
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xs);
  background-color: var(--bg-muted);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.step-item.current {
  border: 2px solid var(--accent);
  background-color: var(--bg-surface);
  font-weight: 700;
}

.admin-order-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: clamp(18px, 2.5vw, 24px);
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.toast-msg {
  position: fixed;
  bottom: 88px;
  right: 16px;
  background-color: var(--text-primary);
  color: var(--bg-surface);
  padding: 12px 18px;
  border-radius: var(--radius-xs);
  font-weight: 600;
  z-index: 60;
  border: 1px solid var(--border-strong);
}

.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--bg-surface);
  border-top: 1px solid var(--border-color);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  padding: 6px 8px calc(6px + env(safe-area-inset-bottom));
  z-index: 30;
}

.mobile-bottom-nav .btn {
  font-size: 0.75rem;
  padding: 6px 4px;
}

@media (min-width: 640px) {
  .catalogue-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .progress-steps {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  body {
    padding-bottom: 40px;
  }
  .desktop-nav {
    display: flex;
  }
  .mobile-bottom-nav {
    display: none;
  }
  .catalogue-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .split-layout {
    grid-template-columns: 1fr 1.15fr;
    align-items: start;
  }
  .admin-order-card {
    grid-template-columns: 1.2fr 1fr;
    align-items: start;
  }
}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      data-theme="light"
      className={`${cormorant.variable} ${sourceSerif.variable} ${bebasNeue.variable}`}
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
      </head>
      <body>{children}</body>
    </html>
  );
}