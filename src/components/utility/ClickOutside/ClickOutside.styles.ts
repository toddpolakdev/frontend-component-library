import styled from 'styled-components';

/**
 * `display: contents` makes this wrapper layout-transparent — children lay out
 * exactly as if it weren't there, while still giving the hook a node to test
 * containment against.
 *
 * The source avoided a wrapper by cloning its single child and injecting a ref,
 * which is the fragile part: it needed exactly one element child that forwards
 * refs, threw on Fragments, and broke on plain text or on a function component
 * that doesn't forward. A layout-neutral wrapper accepts any children.
 *
 * If a `className` is passed that needs a real box, set `display` in that class.
 */
export const Wrapper = styled.div`
  display: contents;
`;
