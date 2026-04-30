import { NoSSR } from '@rspress/core/runtime';
import type { ButtonHTMLAttributes } from 'react';
import { useRef, useState } from 'react';

export const frontmatter = {
  date: '2026-04-29',
  description: '基于cloudflare Work AI实现的语音转文本',
  title: '在线语音转文本',
  footer: false,
};

const Button = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className={`mx-5 px-4 py-2 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600
      disabled:opacity-50 disabled:cursor-not-allowed ${props.className}`}
  />
);

const AsrComponent: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [result, setReault] = useState('');

  const [audioFile, setAudioFile] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav',
        });
        setAudioFile(audioBlob);
        setFileName(`recording_${Date.now()}.webm`);

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (_) {
      alert('无法获取麦克风权限');
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleRecording = async () => {
    if (!recording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startTransition = async () => {
    if (!audioFile) return;
    setIsConverting(true);
    const formData = new FormData();
    formData.append('audio', audioFile, fileName);

    try {
      const response = await fetch('https://api.vhcffh.com/api/v1/stt', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.code === 200) {
          setReault(data.data.text);
        } else {
          setReault(`转换失败：${data.msg}`);
        }
      }
    } catch {
      setReault('请求失败');
    } finally {
      setIsConverting(false);
    }
  };
  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl">{frontmatter.title}</div>
      <div className="mt-10 text-sm text-gray-500">{fileName}</div>
      <div className="w-full mt-2">
        <div className="flex flex-row justify-center w-100%">
          <Button
            className={recording ? 'bg-red-500 hover:bg-red-600' : ''}
            onClick={handleRecording}
          >
            {recording ? `结束录制` : `开始录制`}{' '}
          </Button>
          <Button
            className={isConverting ? 'bg-red-500 hover:bg-red-600' : ''}
            onClick={startTransition}
            disabled={isConverting}
          >
            {isConverting ? `转换中` : `开始转换`}
          </Button>
        </div>
        <div className="border-1 rounded border-gray-400 mt-5 px-2 py-1 min-h-30">
          {result || '转换结果'}
        </div>
        <div className="pt-10 text-sm text-gray-500">
          基于Cloudflare Work AI调用openai/whisper模型实现实现语音转文本
        </div>
      </div>
    </div>
  );
};

const Asr = () => (
  <NoSSR>
    <AsrComponent />
  </NoSSR>
);

export default Asr;

