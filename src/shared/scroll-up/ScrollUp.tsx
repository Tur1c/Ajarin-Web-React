import { useRef } from "react";

export const scrollUp = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const ScrollTargetRef = useRef<HTMLBodyElement>(null); // Reference to scroll target

  const handleScrollUp = () => {
    if (ScrollTargetRef.current) {
      ScrollTargetRef.current.scroll({ top: 0, behavior: "smooth" });
    }
  };

  return handleScrollUp;
};
