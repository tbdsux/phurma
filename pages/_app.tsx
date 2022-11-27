import { Karla } from "@next/font/google";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { fetcher } from "../lib/fetcher";
import "../styles/globals.css";

const karla = Karla({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher: fetcher }}>
      <style jsx global>{`
        :root {
          --font-karla: ${karla.style.fontFamily};
        }
      `}</style>

      <DefaultSeo titleTemplate="%s | phurma" />

      <Component {...pageProps} />
    </SWRConfig>
  );
}
