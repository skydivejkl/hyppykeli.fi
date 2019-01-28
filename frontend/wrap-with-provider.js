import React from "react";
import {Provider} from "react-redux";
import {createStore} from "redux";

import {leanReducer} from "lean-redux";

const store = createStore(
    leanReducer,
    {},
    typeof __REDUX_DEVTOOLS_EXTENSION__ !== "undefined"
        ? // eslint-disable-next-line no-undef
          __REDUX_DEVTOOLS_EXTENSION__()
        : s => s,
);

// eslint-disable-next-line react/display-name,react/prop-types
export default ({element}) => <Provider store={store}>{element}</Provider>;
