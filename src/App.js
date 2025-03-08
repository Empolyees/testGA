import React, { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import "./App.css"
import CookieConsentModal from "./components/CookieConsetModal";

function App() {
    const [cookieConsent, setCookieConsent] = useState(null);

    useEffect(() => {
        const consent = localStorage.getItem("cookieConsent");
        if (consent === "granted") {
            ReactGA.initialize("G-K3DDYP9KGG");
            ReactGA.send("pageview");
        } else if (consent === "denied") {
            ReactGA.initialize("G-K3DDYP9KGG", { anonymizeIp: true });
            ReactGA.send("pageview");
        }
        setCookieConsent(consent);
    }, []);

    const handleConsent = (consent) => {
        localStorage.setItem("cookieConsent", consent);
        setCookieConsent(consent);
        if (consent === "granted") {
            ReactGA.initialize("G-K3DDYP9KGG");
            ReactGA.send("pageview");
        } else {
            ReactGA.initialize("G-K3DDYP9KGG", { anonymizeIp: true,storage: "none" });
            ReactGA.send("pageview");
        }
    };

    return (
        <>
        {cookieConsent === null && <CookieConsentModal onConsent={handleConsent} />}
        <div className="App">
            <header className="App-header">
                <button onClick={() => ReactGA.event({category: "User", action: "Clicked button"})}>
                    Click me
                </button>

                <button onClick={() => ReactGA.event({category: "User", action: "Best Button"})}>
                    Click me, I am better button !!!
                </button>
            </header>
        </div>
        </>
    );
}

export default App;

