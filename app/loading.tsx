import styled, { keyframes } from "styled-components";

import { theme } from "@/styles/theme";

export default function Loading() {
  return (
    <Wrapper>
      <Spinner />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: grid;
  place-items: center;
  min-height: 320px;
  padding: 80px 20px;
`;

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  width: 28px;
  height: 28px;
  border: 2.5px solid ${theme.colors.border};
  border-top-color: ${theme.colors.accent};
  border-radius: 50%;
  animation: ${rotate} 0.7s linear infinite;
`;
