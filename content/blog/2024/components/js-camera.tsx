import React, { useState, useRef } from 'react'
import { Button, Flex } from 'antd'

const JsCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [isRecording, setIsRecording] = useState(false)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      const recorder = new MediaRecorder(stream)
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prevChunks) => [...prevChunks, event.data])
        }
      }

      recorder.onstop = () => {
        console.log('Recording stopped')
      }

      setMediaRecorder(recorder)
    } catch (error) {
      console.error('Failed to access camera:', error)
    }
  }

  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start()
      setRecordedChunks([])
      setIsRecording(true)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }

  const downloadRecording = () => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = 'recording.webm'
      a.click()

      URL.revokeObjectURL(url)
    }
  }

  return (
    <Flex vertical={true} gap="large" align="center">
      <video
        ref={videoRef}
        autoPlay
        style={{ width: '80%', border: '1px solid black' }}
      ></video>
      <Flex gap="large" align="center" wrap justify='center'>
        <Button
          type="primary"
          onClick={startCamera}
          disabled={mediaRecorder !== null}
        >
          启用摄像头
        </Button>
        <Button
          type="primary"
          onClick={startRecording}
          disabled={!mediaRecorder || isRecording}
        >
          开始录像
        </Button>
        <Button
          type="primary"
          onClick={stopRecording}
          disabled={!mediaRecorder || !isRecording}
        >
          停止录像
        </Button>
        <Button
          type="primary"
          onClick={downloadRecording}
          disabled={recordedChunks.length === 0}
        >
          下载录像
        </Button>
      </Flex>
    </Flex>
  )
}

export default JsCamera
