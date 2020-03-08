import { get } from "idb-keyval";
import { useEffect } from "react";
import { useRouter } from "next/router";

function PWAStart() {
    useEffect(() => {
        get<string>("last-location").then(last => {
            window.location = (last || "/") as any;
        });
    }, []);

    return null;
}

export default PWAStart;
