import React from "react";
import { forwardRef, useImperativeHandle, useRef } from "react"

export type ScrollToViewHandle = {
  scroll: () => void;
};

type Props = { delay?: number };

const ScrollToView = forwardRef<ScrollToViewHandle, Props>(function (props, ref) {
  const { delay = 1000 } = props

  const EndRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => {
    return {
      scroll () {
        setTimeout(() => {
          EndRef.current && EndRef.current.scrollIntoView({ behavior: "smooth" })
        }, delay)
      }
    };
  }, []);
  return <div ref={EndRef}></div>
})

export default ScrollToView