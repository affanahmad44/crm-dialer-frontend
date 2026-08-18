import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "CRM Dialer",
  description: "Professional CRM Dialer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}