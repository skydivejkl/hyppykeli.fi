import React from "react";
import {values, omit} from "lodash/fp";
import {compose, mapProps} from "recompose";
import {withRouter} from "react-router-dom";
import moment from "moment";
import gpsDistanceKm from "gps-distance";

export const withRouterProps = mapper => compose(
    mapProps(props => ({originalProps: props})),
    withRouter,
    mapProps(({originalProps, ...router}) => {
        return {
            ...originalProps,
            ...mapper(router, originalProps),
        };
    })
);

export const gpsDistance = (from, to) => {
    const km = gpsDistanceKm(
        ...[from.lat, from.lon, to.lat, to.lon].map(s => parseFloat(s, 10))
    );

    return km;
};


export const withBrowserEvent = (source, eventName, cb, capture) => {
    return Component => class BrowserEvent extends React.Component {
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
    return React.createClass({
        displayName: "addSetTimeout",

        componentWillMount() {
            this.counter = 0;
            this.timeouts = {};
        },

        setTimeout(cb, t) {
            const i = this.counter++;
            const wrap = () => {
                this.timeouts = omit(i, this.timeouts);
                cb();
            };

            this.timeouts[i] = setTimeout(wrap, t);
        },

        componentWillUnmount() {
            values(this.timeouts).forEach(clearTimeout);
        },

        render() {
            return <Component {...this.props} setTimeout={this.setTimeout} />;
        },
    });
}

export const fromNowWithClock = t =>
    ` ${moment(t).fromNow()} (klo ${moment(t).format("HH:mm")})`;

export const getWindowOr = (mock) => typeof window !== "undefined" ? window : mock;
