import { useEffect } from "react";
import "@/styles/globals.css";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { useRouter } from "next/router";
import { ENVIRONMENT, FIREBASE_CONFIG } from "@/lib/config";
import Providers from "@/components/layout/Providers";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  // hide console.log in PROD
  if (ENVIRONMENT === "PROD") console.log = () => {};

  const app = initializeApp(FIREBASE_CONFIG);
  const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

  useEffect(() => {
    NProgress.configure({ showSpinner: false });
    router.events.on("routeChangeStart", () => NProgress.start());
    router.events.on("routeChangeComplete", () => NProgress.done());
    router.events.on("routeChangeError", () => NProgress.done());
  }, []);

  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
}
