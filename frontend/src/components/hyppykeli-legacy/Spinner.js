import "react-spinner/react-spinner.css";

import styled from "@emotion/styled";

import ReactSpinner from "react-spinner";

const Spinner = styled(ReactSpinner)(
    {
        width: "100% !important",
        height: "100% !important",
    },
    props => ({
        ".react-spinner_bar": {
            backgroundColor: `${props.color} !important`,
        },
    }),
);

export default Spinner;
