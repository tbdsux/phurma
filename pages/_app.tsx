import { Karla } from "@next/font/google";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import "../styles/globals.css";

const karla = Karla({ subsets: ["latin"], variable: "--font-karla" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${karla.variable} font-sans`}>
      <DefaultSeo titleTemplate="%s | phurma" />

      <Component {...pageProps} />
    </main>
  );
}
