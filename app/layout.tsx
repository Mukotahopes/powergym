import "./globals.css";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400","600","700"] });

export const metadata = {
  title: "PowerGym",
  description: "AI-driven fitness platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className={`${montserrat.className} bg-light text-dark min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
