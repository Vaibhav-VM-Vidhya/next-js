import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#020617',
};

export const metadata: Metadata = {
  title: 'Classic Smile Dental Care & Implant Centre | Dr. Abhishek V. Kamble',
  description:
    'Multispeciality Dental Clinic & Oral Implantology in Charholi, Pune. Led by Dr. Abhishek V. Kamble (BDS, MDS), Periodontist & Oral Implantologist.',
  keywords: [
    'Dental Clinic Pune',
    'Dental Implants Charholi',
    'Periodontist Pune',
    'Dr Abhishek Kamble',
    'Root Canal Treatment Pune',
    'Classic Smile Dental Care',
  ],
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
