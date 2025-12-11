// src/components/VideoPlayer.tsx
import {
  forwardRef,
  type VideoHTMLAttributes,
  type Ref,
  type ReactNode,
} from "react";

interface VideoPlayerProps extends VideoHTMLAttributes<HTMLVideoElement> {
  desktop?: boolean;
  wrapperClassName?: string;
  overlay?: ReactNode;
}

const VideoPlayer = forwardRef(function VideoPlayer(
  {
    desktop = false,
    className = "",
    wrapperClassName = "",
    overlay,
    autoPlay,
    muted,
    playsInline,
    controls,
    preload,
    ...rest
  }: VideoPlayerProps,
  ref: Ref<HTMLVideoElement>,
) {
  const baseClasses = desktop
    ? "w-full h-[24rem] object-cover rounded-2xl"
    : "w-full aspect-video object-cover rounded-2xl";

  const resolvedAutoPlay = autoPlay ?? true;
  const resolvedMuted = muted ?? true;
  const resolvedPlaysInline = playsInline ?? true;
  const resolvedControls = controls ?? desktop;
  const resolvedPreload = preload ?? "metadata";

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-card/40 ${wrapperClassName}`.trim()}
    >
      <video
        ref={ref}
        className={`${baseClasses} ${className}`.trim()}
        autoPlay={resolvedAutoPlay}
        muted={resolvedMuted}
        playsInline={resolvedPlaysInline}
        controls={resolvedControls}
        preload={resolvedPreload}
        {...rest}
      />
      {overlay}
    </div>
  );
});

export default VideoPlayer;
