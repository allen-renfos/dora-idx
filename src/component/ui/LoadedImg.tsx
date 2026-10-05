"use client";

import { ImgHTMLAttributes, useEffect, useRef, useState } from "react";

/**
 * Plain <img> that takes no space until it has loaded and disappears if it
 * fails, so a slow or broken logo never leaves a blank box or broken icon.
 * `onFail` lets the caller swap in its own fallback instead.
 */
export function LoadedImg({
  onFail,
  className = "",
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & { onFail?: () => void }) {
  const ref = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<"loading" | "loaded" | "failed">("loading");

  // A cached image can finish before hydration, so onLoad never fires.
  useEffect(() => {
    const img = ref.current;
    if (!img?.complete) setState("loading");
    else setState(img.naturalWidth > 0 ? "loaded" : "failed");
  }, [props.src]);

  useEffect(() => {
    if (state === "failed") onFail?.();
  }, [state, onFail]);

  if (state === "failed") return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img
      ref={ref}
      {...props}
      className={`${className} ${state === "loaded" ? "" : "!hidden"}`}
      onLoad={() => setState("loaded")}
      onError={() => setState("failed")}
    />
  );
}
