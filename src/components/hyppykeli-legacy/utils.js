import React from "react";
import { values, omit } from "lodash";
import dayjs from "dayjs";
import gpsDistanceKm from "gps-distance";

import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const gpsDistance = (from, to) => {
    const km = gpsDistanceKm(
        ...[from.lat, from.lon, to.lat, to.lon].map(s => parseFloat(s, 10)),
    );

    return km;
};

export const withBrowserEvent = (source, eventName, cb, capture) => {
    return Component =>
        class BrowserEvent extends React.Component {
            constructor(props) {
                super(props);
                this.state = {};
            }

            componentDidMount() {
                this.wrap = event => {
                    const newProps = cb({
                        event,
                        state: this.state,
                        props: this.props,
                        setProps: props => {
                            this.setState(props);
                        },
                    });
                    if (newProps) {
                        this.setState(newProps);
                    }
                };

                source.addEventListener(eventName, this.wrap, capture);
            }

            componentWillUnmount() {
                source.removeEventListener(eventName, this.wrap, capture);
            }

            render() {
                return <Component {...this.props} {...this.state} />;
            }
        };
};

export function addSetTimeout(Component) {
    return class AddSetTimeout extends React.Component {
        constructor(props) {
            super(props);
            this.counter = 0;
            this.timeouts = {};
            this.setTimeout = this.setTimeout.bind(this);
        }

        setTimeout(cb, t) {
            const i = this.counter++;
            const wrap = () => {
                this.timeouts = omit(this.timeouts, i);
                cb();
            };

            this.timeouts[i] = setTimeout(wrap, t);
        }

        componentWillUnmount() {
            values(this.timeouts).forEach(clearTimeout);
        }

        render() {
            return <Component {...this.props} setTimeout={this.setTimeout} />;
        }
    };
}

export const fromNowWithClock = t =>
    ` ${dayjs(t).fromNow()} (klo ${dayjs(t).format("HH:mm")})`;

export const getWindowOr = mock =>
    typeof window !== "undefined" ? window : mock;
