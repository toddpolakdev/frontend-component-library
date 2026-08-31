import styled from 'styled-components';

/**
 * The single shell every glyph renders into.
 *
 * `flex-shrink: 0` is the important one — an icon dropped into a flex row next
 * to text gets squashed without it. `vertical-align: middle` stops the baseline
 * wobble you get from an inline SVG sitting next to a label.
 */
export const Svg = styled.svg`
  display: inline-block;
  flex-shrink: 0;
  vertical-align: middle;
`;
