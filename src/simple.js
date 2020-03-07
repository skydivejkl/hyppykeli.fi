import styled from "@emotion/styled";

// export {css} from "glamor";

export function simple(component, styles) {
    const comp = styled(component)(styles);

    comp.create = newComp => {
        return styled(newComp)(styles);
    };

    return comp;
}

export default simple;
