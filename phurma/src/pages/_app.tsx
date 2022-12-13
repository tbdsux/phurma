import { Karla } from "@next/font/google";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";

const karla = Karla({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextNProgress color="#f43f5e" />

      <style jsx global>{`
        :root {
          --font-karla: ${karla.style.fontFamily};
        }
      `}</style>

      <DefaultSeo titleTemplate="%s | phurma" />

      <Component {...pageProps} />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        className="text-sm"
        toastClassName="font-sans"
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}
