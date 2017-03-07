import React from "react";
import {compose, mapProps} from "recompose";
import {withRouter} from "react-router-dom";
import moment from "moment";

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

export const fromNowWithClock = t =>
    ` ${moment(t).fromNow()} (klo ${moment(t).format("HH:mm")})`;
