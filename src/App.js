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
        gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
        });
    }, []);

    useEffect(() => {
        if (cookieConsent === "granted") {
            console.log("User granted consent");

            // Uživatel povolil analytiku -> zapnout cookies
            window.gtag("consent", "update", {
                analytics_storage: "granted",
                ad_storage: "granted",
            });

            ReactGA.initialize(GA_TRACKING_ID);
            ReactGA.send("pageview");
        } else if (cookieConsent === "denied") {
            console.log("User denied consent");

            // Uživatel odmítl -> cookies zůstávají vypnuté
            window.gtag("consent", "update", {
                analytics_storage: "denied",
                ad_storage: "denied",
            });

            window.gtag("event", "page_view", {
                anonymize_ip: true,  // IP adresa nebude viditelná
                non_personalized_ads: true  // Žádné personalizované reklamy
            });
        }
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
                        Click me, I am better button !!!
                    </button>
                </header>
            </div>
        </>
    );
}

export default App;



