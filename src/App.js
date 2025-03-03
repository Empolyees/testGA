import { useEffect } from "react";
import ReactGA from "react-ga4";
import "./App.css";

function App() {
    useEffect(() => {
        ReactGA.initialize("G-K3DDYP9KGG"); // Sem vlož svůj GA měřící kód
        ReactGA.send("pageview"); // Odeslání události při načtení stránky
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <button onClick={() => ReactGA.event({ category: "User", action: "Clicked button" })}>
                    Click me
                </button>
            </header>
        </div>
    );
}

export default App;
