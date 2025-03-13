import React, { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import "./App.css";
import CookieConsentModal from "./components/CookieConsetModal";

const GA_TRACKING_ID = "G-K3DDYP9KGG";

function App() {
    const [cookieConsent, setCookieConsent] = useState(() => localStorage.getItem("cookieConsent"));

    useEffect(() => {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        window.gtag = gtag;

        gtag('js', new Date());

        // Výchozí stav = cookies jsou blokovány
        if(cookieConsent === null || cookieConsent === undefined || cookieConsent === "denied"){
        gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
        });
            gtag("config", GA_TRACKING_ID, {
                anonymize_ip: true, // Skryje IP adresu
                storage: "none", // Zakáže ukládání cookies
                client_id: "anonymous_user_" + Math.random().toString(36).substr(2, 9) // Generuje anonymní ID
            });

        }


        if (cookieConsent === "granted") {
            ReactGA.send("pageview");
            console.log("granted")
        }else {
            gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
            });

            gtag("config", GA_TRACKING_ID, {
                anonymize_ip: true,
                storage: "none",
                client_id: "anonymous_" + Math.random().toString(36).substr(2, 9),
                page_path: window.location.pathname,
            });
        }

        const interval = setInterval(() => {
            gtag("event", "user_engagement", {
                engagement_time_msec: 10000,
            });
        }, 10000); // Každých 10 sekund

        return () => clearInterval(interval);
    }, [cookieConsent]);

    const handleConsent = (consent) => {
        localStorage.setItem("cookieConsent", consent);
        setCookieConsent(consent);

        window.gtag("consent", "update", {
            analytics_storage: consent === "granted" ? "granted" : "denied",
            ad_storage: consent === "granted" ? "granted" : "denied",
        });

        if (consent === "granted") {
            ReactGA.initialize(GA_TRACKING_ID);
            ReactGA.send("pageview");
            ReactGA.event("user_engagement")
            window.gtag("config", GA_TRACKING_ID);

            // ✅ Odeslat uživatelskou interakci
            window.gtag("event", "user_engagement", {
                engagement_time_msec: 10000, // Simulujeme 10 sekund aktivity
            });
        }else {
            // ✅ Pošleme anonymního uživatele do Active Users
            window.gtag("config", GA_TRACKING_ID, {
                anonymize_ip: true,
                storage: "none",
                client_id: "anonymous_" + Math.random().toString(36).substr(2, 9),
                page_path: window.location.pathname,
            });
            window.gtag("event", "user_engagement", {
                engagement_time_msec: 10000,
                non_personalized_ads: true, // Nepersonalizovaná data
            });
        }
    };

    return (
        <>
            {cookieConsent === null && <CookieConsentModal onConsent={handleConsent} />}
            <div className="App">
                <header className="App-header">
                    <button
                        onClick={() => {
                            if (cookieConsent === "granted") {
                                ReactGA.event({ category: "User", action: "Clicked button" });
                            } else {
                                console.warn("Cannot track event, consent not granted");
                            }
                        }}
                    >
                        Click me
                    </button>

                    <button
                        onClick={() => {
                            if (cookieConsent === "granted") {
                                ReactGA.event({ category: "User", action: "Best Button" });
                            } else {
                                console.warn("Cannot track event, consent not granted");
                            }
                        }}
                    >
                        Button2
                    </button>
                </header>
            </div>
        </>
    );
}

export default App;



