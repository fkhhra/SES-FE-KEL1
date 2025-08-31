import "antd/dist/antd.css";
import "../styles/globals.scss";
import "../styles/scrollbar.scss";
import "../styles/SelectShare.scss";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/styles.css";
import "react-awesome-slider/dist/styles.css";
import "keen-slider/keen-slider.min.css";
import "react-circular-progressbar/dist/styles.css";
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";
import "swiper/components/scrollbar/scrollbar.scss";
import "react-image-lightbox/style.css";
import { DefaultSeo } from "next-seo";
import { useEffect } from "react";
import Head from "next/head";
import NextNprogress from "nextjs-progressbar";
import "react-nestable/dist/styles/index.css";
// import Gleap from "gleap";

// import your default seo configuration
import SEO from "../next-seo.config";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import toast, { Toaster } from "react-hot-toast";
import useNetworkError from "hooks/useNetworkError";
// import { setInterceptor } from "client/Axios";
import * as gtag from "../lib/gtag";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const { networkErrorHandler, error, resetError } = useNetworkError();

  useEffect(() => {
    if (error?.message) {
      toast.error(error?.message);

      setTimeout(() => {
        resetError();
      }, 300);
    }
  }, [error?.message]);

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  // useEffect(() => {
  //   setInterceptor(networkErrorHandler);
  // }, []);

  // useEffect(() => {
  //   Gleap.initialize("lQhvToETBcdR8FxXpBt1rRRY4obGUxZl");
  // }, []);
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) return;

    const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY; // sinkronkan dengan BE (public key)
    if (!vapidPublic) return;

    const urlBase64ToUint8Array = (base64String) => {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
      return outputArray;
    };

    (async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js');
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') return;

        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublic)
        });

        // kirim subscription ke backend
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/lostfound/save-subscription`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: sub })
        });
      } catch (e) {
        console.error('Push setup failed', e);
      }
    })();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) return;
  
    const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidPublic) return;
  
    const urlBase64ToUint8Array = (base64String) => {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
      const rawData = atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
      return outputArray;
    };
  
    (async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js'); // served by FE (2025)
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') return;
  
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublic),
        });
  
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/lostfound/save-subscription`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: sub }),
        });
      } catch (e) {
        console.error('Push setup failed', e);
      }
    })();
  }, []);

  return (
    <>
      <DefaultSeo {...SEO} />
      <script
        src="https://code.jquery.com/jquery-3.4.1.slim.min.js"
        integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n"
        crossOrigin="anonymous"
      ></script>
      <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/fullcalendar@5.5.1/main.min.js"></script>
      <script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />

      <script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <NextNprogress
        color="#96DAFF"
        startPosition={0.3}
        stopDelayMs={200}
        height="4"
      />
      <AnimatePresence exitBeforeEnter>
        <Component {...pageProps} />
      </AnimatePresence>
      <ToastContainer />
      <Toaster
        containerStyle={{
          zIndex: 10000000011,
        }}
      />
      <div id="shared-modal" />
      <div id="shared-modal-tautan-link" />
      {/* <script src="http://maps.google.com/maps/api/js?sensor=false"></script> */}
      <script
        src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
        integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
        crossOrigin="anonymous"
      ></script>
      {/* <script
        src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/js/bootstrap.min.js"
        integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy"
        crossorigin="anonymous"
      ></script> */}
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
        crossOrigin="anonymous"
      ></script>
      {/* <script src="https://cdn.ckeditor.com/ckeditor5/27.1.0/classic/ckeditor.js"></script> */}
      <script src="/js/app.js"></script>
      <script src="node_modules/browser-detect/dist/browser-detect.umd.js"></script>
      <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
      <script
        id="MathJax-script"
        src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-mml-chtml.min.js"
      ></script>
      <script src="https://unpkg.com/mathlive"></script>
    </>
  );
}

export default MyApp;
