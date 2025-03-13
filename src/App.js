import React, { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import "./App.css";
import CookieConsentModal from "./components/CookieConsetModal";

const GA_TRACKING_ID = "G-K3DDYP9KGG";

function App() {
    const [cookieConsent, setCookieConsent] = useState(() => localStorage.getItem("cookieConsent"));

    useEffect(() => {
        // ✅ Přidáme Google Analytics skript jen jednou
        if (!window.gtag) {
            const script = document.createElement("script");
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            function gtag() { window.dataLayer.push(arguments); }
            window.gtag = gtag;

            gtag('js', new Date());
        }

        console.log("✅ GA inicializován, cookieConsent:", cookieConsent);

        // ✅ Odeslat `page_view` + správné nastavení souhlasu
        if (cookieConsent === "granted") {
            ReactGA.initialize(GA_TRACKING_ID);
            ReactGA.send("pageview");
            console.log("✅ Pageview sent with consent");

            window.gtag("config", GA_TRACKING_ID, {
                page_path: window.location.pathname,
                anonymize_ip: false, // IP není anonymizována
            });
        } else {
            window.gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
            });

            window.gtag("config", GA_TRACKING_ID, {
                anonymize_ip: true, // IP je anonymizována
                storage: "none",
                client_id: "anonymous_" + Math.random().toString(36).substr(2, 9),
                page_path: window.location.pathname,
            });

            console.log("⚠️ Pageview sent anonymously");
        }

        // ✅ Odesílat `user_engagement` každých 10 sekund
        const interval = setInterval(() => {
            window.gtag("event", "user_engagement", {
                engagement_time_msec: 10000,
            });
            console.log("📊 `user_engagement` sent");
        }, 10000);

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
            console.log("✅ Consent granted, sending pageview");

            window.gtag("config", GA_TRACKING_ID);
            window.gtag("event", "user_engagement", {
                engagement_time_msec: 10000,
            });
        } else {
            console.log("⚠️ Consent denied, sending anonymous data");

            window.gtag("config", GA_TRACKING_ID, {
                anonymize_ip: true,
                storage: "none",
                client_id: "anonymous_" + Math.random().toString(36).substr(2, 9),
                page_path: window.location.pathname,
            });

            window.gtag("event", "user_engagement", {
                engagement_time_msec: 10000,
                non_personalized_ads: true,
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



