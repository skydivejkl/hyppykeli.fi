import {navigate} from "gatsby";
import {get} from "idb-keyval";
import {useEffect} from "react";

function PWAStart() {
    useEffect(() => {
        get<string>("last-location").then(last => {
            navigate(last || "/");
        });
    }, []);

    return null;
}

export default PWAStart;
