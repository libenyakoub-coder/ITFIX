import {
  Player, // ✅ AJOUTÉ
  BigPlayButton,
  ControlBar,
  PlayToggle,
  CurrentTimeDisplay,
  TimeDivider,
  DurationDisplay,
  FullscreenToggle,
  VolumeMenuButton,
  ProgressControl
} from 'video-react';

import 'video-react/dist/video-react.css';

interface VideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  aspectRatio?: string | 'auto' | '16:9' | '4:3';
}

export default function Video({
  className,
  src,
  poster,
  autoPlay = false,
  muted = false,
  controls = true,
  aspectRatio = 'auto'
}: VideoProps) {
  return (
    <div className={`min-w-[100px] ${className}`} custom-component="video">
      <style>
        {`
/* TON CSS INTACT */
.video-react-paused .video-react-big-play-button.big-play-button-hide {
    display: block;
}

.video-react .video-react-big-play-button {
    width: 48px;
    height: 40px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    margin-left: -24px !important;
    margin-top: -20px !important;
    background: rgba(7, 12, 20, 0.6) !important;
}

.video-react .video-react-big-play-button:hover {
    background: rgba(7, 12, 20, 0.8) !important;
}

.video-react .video-react-big-play-button:before {
    display: block;
    content: '';
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAqCAYAAADBNhlm...) no-repeat;
    background-size: contain;
    width: 15px;
    height: 16.25px;
    margin: 0 auto;
    position: relative;
}

.h-full > .video-react.video-react-fluid {
    height: 100%;
    padding-top: 0 !important;
    aspect-ratio: 16 / 9;
}
`}
      </style>

      <Player
        poster={poster}
        src={src}
        autoPlay={autoPlay}
        muted={muted}
        aspectRatio={aspectRatio}
      >
        <ControlBar
          disableDefaultControls
          autoHide
          disableCompletely={!controls}
        >
          <PlayToggle key="play-toggle" />
          <VolumeMenuButton key="volume-menu-button" vertical />
          <CurrentTimeDisplay key="current-time-display" />
          <TimeDivider key="time-divider" />
          <DurationDisplay key="duration-display" />
          <ProgressControl key="progress-control" />

          {/* ✅ CORRECTION ICI */}
          <FullscreenToggle key="fullscreen-toggle" actions={undefined as any} />

        </ControlBar>

        <BigPlayButton position="center" />
      </Player>
    </div>
  );
}