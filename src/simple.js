import styled from "@emotion/styled";

/**
 * Backwards compat for https://github.com/esamattis/react-simple
 */
export function simple(component, styles) {
    const comp = styled(component)(styles);

    comp.create = newComp => {
        return styled(newComp)(styles);
    };

    return comp;
}

export default simple;
