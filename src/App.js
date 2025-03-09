import React, { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import "./App.css"
import CookieConsentModal from "./components/CookieConsetModal";

function App() {
    const GA_MEASUREMENT_ID = "G-K3DDYP9KGG";

    const [cookieConsent, setCookieConsent] = useState(null);

    useEffect(() => {
        const storedConsent = localStorage.getItem("cookieConsent");
        setCookieConsent(storedConsent);

        if (storedConsent === "granted") {
            // Inicializace GA4 pouze při souhlasu
            ReactGA.initialize(GA_MEASUREMENT_ID);
            ReactGA.gtag("consent", "update", { analytics_storage: "granted" });
            ReactGA.send("pageview");
        } else if (storedConsent === "denied") {
            // Zabránění ukládání cookies, pokud není souhlas
            window.gtag = function () {};
            ReactGA.initialize(GA_MEASUREMENT_ID, { testMode: true }); // Zabrání sledování
            ReactGA.gtag("consent", "update", { analytics_storage: "denied" });
        }
    }, []);

    const handleConsent = (consent) => {
        localStorage.setItem("cookieConsent", consent);
        setCookieConsent(consent);

        if (consent === "granted") {
            ReactGA.initialize(GA_MEASUREMENT_ID);
            ReactGA.gtag("consent", "update", { analytics_storage: "granted" });
            ReactGA.send("pageview");
        } else {
            window.gtag = function () {}; // Blokace odesílání dat
            ReactGA.initialize(GA_MEASUREMENT_ID, { testMode: true });
            ReactGA.gtag("consent", "update", { analytics_storage: "denied" });
        }
    };

    return (
        <>
            {cookieConsent === null && <CookieConsentModal onConsent={handleConsent} />}
            <div className="App">
                <header className="App-header">
                    <button onClick={() => ReactGA.event({ category: "User", action: "Clicked button" })}>
                        Click me
                    </button>

                    <button onClick={() => ReactGA.event({ category: "User", action: "Best Button" })}>
                        Click me, I am better button !!!
                    </button>
                </header>
            </div>
        </>
    );
}

export default App;

