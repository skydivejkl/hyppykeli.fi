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
    }),
);


export const fromNowWithClock = t => 
                    ` ${moment(t).fromNow()} (klo. ${moment(t).format("HH:mm")})`
