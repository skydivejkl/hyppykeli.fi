import {compose, mapProps} from "recompose";
import {withRouter} from "react-router-dom";

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

