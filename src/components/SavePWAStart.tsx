import { set } from "idb-keyval";
import React, { useEffect } from "react";

function Saver(props: { path: string }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            set("last-location", props.path);
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, [props.path]);

    return null;
}

export function SavePWAStart() {
    return null;
}
