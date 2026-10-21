import { useEffect } from 'react';
import { useLocation } from 'react-router';

// Module-level so StrictMode's double-invoked effects don't double count.
let lastPath = null;
let firstHit = true;

// ?ref= (or utm_source) from the landing URL, e.g. mahir.ws/?ref=resume
function campaignRef() {
    const params = new URLSearchParams(window.location.search);
    return params.get('ref') || params.get('utm_source') || undefined;
}

function send(path) {
    if (path === lastPath) return;
    lastPath = path;
    const vars = { path };
    if (firstHit) {
        vars.referrer = campaignRef();
        firstHit = false;
    }
    window.goatcounter.count(vars);
}

/*
 * Sends a GoatCounter pageview on every route change. The script is loaded
 * with no_onload, so nothing is counted automatically.
 *
 * The GitHub Pages 404.html shim (/?/projects&...) is undone by the inline
 * script in index.html via history.replaceState before React mounts, so
 * useLocation() always sees the real route here.
 */
export default function AnalyticsTracker() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        const path = pathname + hash;

        if (window.goatcounter?.count) {
            send(path);
            return;
        }

        // count.js loads async and may not be ready on the first render.
        // If it's blocked (ad blockers), 'load' never fires and we do nothing.
        const script = document.querySelector('script[data-goatcounter]');
        if (!script) return;
        const onLoad = () => {
            if (window.goatcounter?.count) send(path);
        };
        script.addEventListener('load', onLoad, { once: true });
        return () => script.removeEventListener('load', onLoad);
    }, [pathname, hash]);

    return null;
}
