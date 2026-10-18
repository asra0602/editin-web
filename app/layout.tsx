import type { Metadata } from 'next';
import { Cormorant_Garamond, Source_Serif_4, Bebas_Neue } from 'next/font/google';
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}