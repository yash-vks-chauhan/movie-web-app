import { useCallback, useEffect } from 'react'
import { isIOS, isMobileOnly, isMobileSafari } from 'react-device-detect'
import { OnProgressProps } from 'react-player/base'
import ReactPlayer from 'react-player/file'

import { useStore, useStoreBoolean } from '@/hooks'

import { useFullscreen } from '../hooks'
import {
  resetPlayerState,
  selectPlayerMuted,
  selectPlayerPip,
  selectPlayerPlaybackSpeed,
  selectPlayerPlaying,
  selectPlayerVolume,
  setPlayerBuffering,
  setPlayerDuration,
  setPlayerEnded,
  setPlayerLoaded,
  setPlayerPip,
  setPlayerPlaybackSpeed,
  setPlayerPlaying,
  setPlayerProgress,
  setPlayerReady,
} from '../player.slice'
import { useNodes } from './PlayerNodes'
import { useProps } from './PlayerProps'

export function PlayerNative() {
  const [dispatch, selector] = useStore()
  const { setPlayer, player } = useNodes()
  const { mediaUrl, startTime, onTimeUpdate } = useProps()
  const { exitFullscreen } = useFullscreen()
  const playing = selector(selectPlayerPlaying)
  const volume = selector(selectPlayerVolume)
  const muted = selector(selectPlayerMuted)
  const playbackSpeed = selector(selectPlayerPlaybackSpeed)
  const pip = selector(selectPlayerPip)

  const onReady = useCallback(() => {
    dispatch(setPlayerReady())
    player?.seekTo(startTime, 'seconds')
  }, [dispatch, player, startTime])

  const onDuration = useCallback(
    (duration: number) => {
      dispatch(setPlayerDuration(duration))
    },
    [dispatch],
  )

  const onBuffer = useCallback(() => {
    dispatch(setPlayerBuffering(true))
  }, [dispatch])

  const onBufferEnd = useCallback(() => {
    dispatch(setPlayerBuffering(false))
  }, [dispatch])

  const onPlay = useCallback(() => {
    dispatch(setPlayerPlaying(true))
  }, [dispatch])

  const onPause = useCallback(() => {
    dispatch(setPlayerPlaying(false))
  }, [dispatch])

  const onProgress = useCallback(
    (progress: OnProgressProps) => {
      dispatch(setPlayerProgress(progress.playedSeconds))
      dispatch(setPlayerLoaded(progress.loadedSeconds))
      onTimeUpdate(progress.playedSeconds)
    },
    [dispatch, onTimeUpdate],
  )

  const onSeek = useCallback(
    (seconds: number) => {
      dispatch(setPlayerProgress(seconds))
    },
    [dispatch],
  )

  const onPlaybackRateChange = useCallback(
    (rate: number) => {
      dispatch(setPlayerPlaybackSpeed(rate))
    },
    [dispatch],
  )

  const { setTrue: onEnablePIP, setFalse: onDisablePIP } = useStoreBoolean(setPlayerPip)

  const onEnded = useCallback(() => {
    dispatch(setPlayerEnded())
    if (isIOS && (isMobileOnly || isMobileSafari)) {
      exitFullscreen()
    }
  }, [dispatch, exitFullscreen])

  useEffect(() => {
    return () => {
      dispatch(resetPlayerState())
    }
  }, [dispatch])

  return (
    <div className='player-wrapper'>
      <ReactPlayer
        ref={setPlayer}
        className='player'
        width='100%'
        height='100%'
        url={mediaUrl}
        controls={false}
        playsinline={true}
        loop={false}
        stopOnUnmount={false}
        config={{
          forceHLS: true,
          forceSafariHLS: true,
          hlsVersion: '1.4.10',
        }}
        playing={playing}
        volume={volume / 100}
        muted={muted}
        playbackRate={playbackSpeed}
        progressInterval={1000 / playbackSpeed}
        pip={pip}
        onReady={onReady}
        onDuration={onDuration}
        onBuffer={onBuffer}
        onBufferEnd={onBufferEnd}
        onPlay={onPlay}
        onPause={onPause}
        onProgress={onProgress}
        onSeek={onSeek}
        onPlaybackRateChange={onPlaybackRateChange}
        onEnablePIP={onEnablePIP}
        onDisablePIP={onDisablePIP}
        onError={(err) => {
          console.log('error', err)
        }}
        onEnded={onEnded}
      />
    </div>
  )
}
