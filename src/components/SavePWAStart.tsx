import { set } from "idb-keyval";
import React, { useEffect } from "react";

export function SavePWAStart() {
    useEffect(() => {
        const timer = setTimeout(() => {
            set("last-location", window.location.pathname);
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    return null;
}
