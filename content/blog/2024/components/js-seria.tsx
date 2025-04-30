import React, { useState, useRef } from 'react'
import SerialPort from 'serialport'
import { Button, Input, Select, Form, message, Space } from 'antd'

const { Option } = Select

interface SerialPortConfig {
  baudRate: number
  dataBits: number
  stopBits: number
  parity: 'none' | 'even' | 'odd'
}

const JsSeria: React.FC = () => {
  const [port, setPort] = useState<SerialPort | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [config, setConfig] = useState<SerialPortConfig>({
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
  })
  const [output, setOutput] = useState<string[]>([])
  const [input, setInput] = useState('')
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null)

  const connectPort = async () => {
    try {
      const selectedPort = await navigator.serial.requestPort()
      await selectedPort.open(config)
      setPort(selectedPort)

      const reader = selectedPort.readable?.getReader()
      if (reader) {
        readerRef.current = reader
        readData(reader)
      }

      setIsConnected(true)
      message.success('Connected to serial port!')
    } catch (error) {
      console.error(error)
      message.error('Failed to connect to serial port.')
    }
  }

  const disconnectPort = async () => {
    try {
      readerRef.current?.cancel()
      readerRef.current = null

      port?.close()
      setPort(null)
      setIsConnected(false)
      message.success('Disconnected from serial port!')
    } catch (error) {
      console.error(error)
      message.error('Failed to disconnect from serial port.')
    }
  }

  const readData = async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
    try {
      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        if (value) {
          const text = new TextDecoder().decode(value)
          setOutput((prev) => [...prev, text])
        }
      }
    } catch (error) {
      console.error('Error reading from serial port:', error)
    }
  }

  const sendData = async () => {
    if (port?.writable) {
      const writer = port.writable.getWriter()
      await writer.write(new TextEncoder().encode(input))
      writer.releaseLock()
      setInput('')
    } else {
      message.error('Port is not writable.')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <Form layout="inline">
        <Form.Item label="波特率">
          <Select
            value={config.baudRate}
            onChange={(value) => setConfig({ ...config, baudRate: value })}
            disabled={isConnected}
            style={{ width: 100 }}
          >
            <Option value={9600}>9600</Option>
            <Option value={115200}>115200</Option>
            <Option value={1000000}>1000000</Option>
            <Option value={2000000}>2000000</Option>
            <Option value={3000000}>3000000</Option>
          </Select>
        </Form.Item>
        <Form.Item label="数据位">
          <Select
            value={config.dataBits}
            onChange={(value) => setConfig({ ...config, dataBits: value })}
            disabled={isConnected}
          >
            <Option value={8}>8</Option>
            <Option value={7}>7</Option>
          </Select>
        </Form.Item>
        <Form.Item label="停止位">
          <Select
            value={config.stopBits}
            onChange={(value) => setConfig({ ...config, stopBits: value })}
            disabled={isConnected}
          >
            <Option value={1}>1</Option>
            <Option value={2}>2</Option>
          </Select>
        </Form.Item>
        <Form.Item label="校验位">
          <Select
            value={config.parity}
            onChange={(value) =>
              setConfig({ ...config, parity: value as 'none' | 'even' | 'odd' })
            }
            disabled={isConnected}
          >
            <Option value="none">None</Option>
            <Option value="even">Even</Option>
            <Option value="odd">Odd</Option>
          </Select>
        </Form.Item>
        <Space>
          <Button type="primary" onClick={connectPort} disabled={isConnected}>
            连接
          </Button>
          <Button onClick={disconnectPort} disabled={!isConnected}>
            断开
          </Button>
        </Space>
      </Form>

      <div
        style={{
          border: '1px solid #d9d9d9',
          padding: '10px',
          height: '150px',
          overflowY: 'auto',
          borderRadius: '5px',
          marginTop: '20px',
        }}
      >
        {output.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>

      <Space.Compact style={{ width: '100%', marginTop: '20px' }}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter data to send"
        />
        <Button type="primary" onClick={sendData} disabled={!isConnected}>
          发送
        </Button>
      </Space.Compact>
    </div>
  )
}

export default JsSeria
