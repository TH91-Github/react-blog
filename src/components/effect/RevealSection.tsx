import { ReactNode } from "react";
import styled from "styled-components";
import { transitions } from "assets/style/Variable";
import { useIntersectionReveal } from "utils/hook/useIntersectionReveal";

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export default function RevealSection({
  children,
  className,
  delay = 0,
  threshold,
  rootMargin,
  triggerOnce,
}: RevealSectionProps) {
  const { isVisible, targetRef } = useIntersectionReveal({
    threshold,
    rootMargin,
    triggerOnce,
  });

  return (
    <StyleRevealSection
      ref={targetRef}
      className={`${className ?? ""} ${isVisible ? "is-visible" : ""}`.trim()}
      $delay={delay}>
      {children}
    </StyleRevealSection>
  );
}

const StyleRevealSection = styled.section<{ $delay: number }>`
  opacity: 0;
  transform: translate3d(0, 56px, 0);
  transition:
    opacity 0.9s ease,
    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: ${({ $delay }) => `${$delay}s`};
  will-change: opacity, transform;

  &.is-visible {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    transform: none;
    transition: ${transitions.base};
    transition-delay: 0s;
  }
`;
