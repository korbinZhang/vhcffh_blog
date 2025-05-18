import { useEffect, useRef, useState } from 'react'
import { HAND_CONNECTIONS, Hands } from '@mediapipe/hands'
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'
import { Camera } from '@mediapipe/camera_utils'

export const CameraHands = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [_, setDotCount] = useState(1)
  useEffect(() => {
    const videoElement = videoRef.current!
    const canvasElement = canvasRef.current!
    const canvasCtx = canvasElement.getContext('2d')!
    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    })

    const loadingTimer = setInterval(() => {
      setDotCount((prev) => {
        const next = (prev + 1) % 4
        console.log(Date())
        console.log(next)
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)
        canvasCtx.textAlign = 'center'
        canvasCtx.font = '3rem Georgia'
        canvasCtx.fillText(
          '加载中' + ' .'.repeat(next) + '  '.repeat(4 - next),
          canvasElement.width / 2,
          canvasElement.height / 2
        )
        return next
      })
    }, 1000)

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
    })

    hands.onResults((results) => {
      clearInterval(loadingTimer)
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      )
      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
            color: '#00FF00',
          })
          drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', radius: 2 })
        }
      }
      canvasCtx.restore()
    })

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({ image: videoElement })
      },
      width: 640,
      height: 480,
    })

    camera.start()

    return () => {
      camera.stop()
    }
  }, [])

  return (
    <div>
      <video ref={videoRef} style={{ display: 'none' }} />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ margin: 'auto' }}
      />
    </div>
  )
}

export default CameraHands
