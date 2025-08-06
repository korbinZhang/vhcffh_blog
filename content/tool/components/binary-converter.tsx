import React, { useState, useMemo, useCallback, useEffect } from 'react'

// --- 类型定义 ---
interface TypeInfo {
  name: string
  bytes: number
  set: (view: DataView, value: number, littleEndian: boolean) => void
  get: (view: DataView, littleEndian: boolean) => number
}

const TYPE_INFO: TypeInfo[] = [
  {
    name: 'int8',
    bytes: 1,
    set: (v, val) => v.setInt8(0, val),
    get: (v) => v.getInt8(0),
  },
  {
    name: 'uint8',
    bytes: 1,
    set: (v, val) => v.setUint8(0, val),
    get: (v) => v.getUint8(0),
  },
  {
    name: 'int16',
    bytes: 2,
    set: (v, val, le) => v.setInt16(0, val, le),
    get: (v, le) => v.getInt16(0, le),
  },
  {
    name: 'uint16',
    bytes: 2,
    set: (v, val, le) => v.setUint16(0, val, le),
    get: (v, le) => v.getUint16(0, le),
  },
  {
    name: 'int32',
    bytes: 4,
    set: (v, val, le) => v.setInt32(0, val, le),
    get: (v, le) => v.getInt32(0, le),
  },
  {
    name: 'uint32',
    bytes: 4,
    set: (v, val, le) => v.setUint32(0, val, le),
    get: (v, le) => v.getUint32(0, le),
  },
  {
    name: 'float32',
    bytes: 4,
    set: (v, val, le) => v.setFloat32(0, val, le),
    get: (v, le) => v.getFloat32(0, le),
  },
  {
    name: 'float64',
    bytes: 8,
    set: (v, val, le) => v.setFloat64(0, val, le),
    get: (v, le) => v.getFloat64(0, le),
  },
]

// --- 辅助函数 ---
const isFloatType = (name: string) => name.startsWith('float')

// --- 子组件 ---

const ByteChunk = ({ byte }: { byte: string }) => (
  <div className="font-mono bg-gray-200 text-gray-800 rounded px-2 py-1 text-center">
    {byte}
  </div>
)

const ConversionCard = React.memo(
  ({
    type,
    value,
    onValueChange,
    onFocus,
    onBlur,
  }: {
    type: TypeInfo
    value: string
    onValueChange: (text: string) => void
    onFocus: () => void
    onBlur: () => void
  }) => (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold font-mono mb-2">{type.name}</h3>
      <input
        type="text"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        className="w-full border px-2 py-1 rounded font-mono"
        placeholder={`输入 ${type.name} 值`}
      />
    </div>
  )
)

// --- 主组件 ---
const BinaryConverter = () => {
  const [hex, setHex] = useState('')
  const [littleEndian, setLittleEndian] = useState(false)
  const [floatPrecision, setFloatPrecision] = useState(3)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [displayValues, setDisplayValues] = useState<Record<string, string>>({})

  const bytes = useMemo(() => {
    const sanitized = hex.replace(/\s+/g, '').toUpperCase()
    if (!/^[0-9A-F]*$/.test(sanitized) || sanitized.length % 2 !== 0) {
      return new Uint8Array(0)
    }
    const arr = new Uint8Array(sanitized.length / 2)
    for (let i = 0; i < sanitized.length; i += 2) {
      arr[i / 2] = parseInt(sanitized.slice(i, i + 2), 16)
    }
    return arr
  }, [hex])

  const conversionResults = useMemo(() => {
    const results: Record<string, number[]> = {}
    const buffer = bytes.buffer

    for (const type of TYPE_INFO) {
      results[type.name] = []
      if (bytes.length < type.bytes) continue

      for (let i = 0; i <= bytes.length - type.bytes; i += type.bytes) {
        const slice = buffer.slice(i, i + type.bytes)
        const view = new DataView(slice)
        try {
          results[type.name].push(type.get(view, littleEndian))
        } catch {}
      }
    }
    return results
  }, [bytes, littleEndian])

  useEffect(() => {
    const newDisplayValues: Record<string, string> = {}
    for (const type of TYPE_INFO) {
      if (type.name === focusedField) continue

      const values = conversionResults[type.name] || []
      const isFloat = isFloatType(type.name)
      const formatted = values
        .map((v) =>
          isFloat ? v.toFixed(floatPrecision) : v.toString()
        )
        .join(', ')
      newDisplayValues[type.name] = formatted
    }
    setDisplayValues((current) => ({ ...current, ...newDisplayValues }))
  }, [conversionResults, floatPrecision, focusedField])

  const handleNumberChange = useCallback(
    (typeName: string, rawVal: string) => {
      setDisplayValues((current) => ({ ...current, [typeName]: rawVal }))

      const type = TYPE_INFO.find((t) => t.name === typeName)
      if (!type) return

      const trimmed = rawVal.trim().split(',')[0]
      if (trimmed === '') {
        setHex('')
        return
      }

      const isFloat = isFloatType(typeName)
      const isValidFormat = isFloat
        ? /^-?\d*\.?\d*$/.test(trimmed)
        : /^-?\d+$/.test(trimmed)

      if (!isValidFormat) return

      const number = isFloat ? parseFloat(trimmed) : parseInt(trimmed, 10)
      if (isNaN(number)) return

      try {
        const buffer = new ArrayBuffer(type.bytes)
        const view = new DataView(buffer)
        type.set(view, number, littleEndian)

        const hexStr = Array.from(new Uint8Array(buffer))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('')
          .toUpperCase()
        setHex(hexStr)
      } catch {}
    },
    [littleEndian]
  )

  const handleBlur = (typeName: string) => {
    setFocusedField(null)
    const values = conversionResults[typeName] || []
    const isFloat = isFloatType(typeName)
    const formatted = values
      .map((v) => (isFloat ? v.toFixed(floatPrecision) : v.toString()))
      .join(', ')
    setDisplayValues((current) => ({ ...current, [typeName]: formatted }))
  }

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg shadow bg-white">
        <h3 className="text-lg font-semibold mb-2">输入</h3>
        <textarea
          className="w-full border px-2 py-1 rounded font-mono text-lg"
          rows={3}
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          placeholder="在此输入 Hex, e.g., 41 42 43 44"
        />
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <label className="font-semibold">字节序:</label>
            <button
              onClick={() => setLittleEndian(false)}
              className={`px-3 py-1 rounded ${!littleEndian ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              大端 (Big)
            </button>
            <button
              onClick={() => setLittleEndian(true)}
              className={`px-3 py-1 rounded ${littleEndian ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              小端 (Little)
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="precision" className="font-semibold">
              浮点数精度:
            </label>
            <input
              id="precision"
              type="number"
              min="0"
              max="20"
              value={floatPrecision}
              onChange={(e) => setFloatPrecision(parseInt(e.target.value, 10))}
              className="w-20 border px-2 py-1 rounded"
            />
          </div>
        </div>
      </div>

      {bytes.length > 0 && (
        <div className="p-4 rounded-lg shadow bg-white">
          <h3 className="text-lg font-semibold mb-2">Hex Bytes</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(bytes).map((byte, i) => (
              <ByteChunk key={i} byte={byte.toString(16).padStart(2, '0').toUpperCase()} />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          'uint8',
          'uint16',
          'uint32',
          'float32',
          'int8',
          'int16',
          'int32',
          'float64',
        ].map((typeName) => {
          const type = TYPE_INFO.find((t) => t.name === typeName)
          if (!type) return null
          return (
            <ConversionCard
              key={type.name}
              type={type}
              value={displayValues[type.name] || ''}
              onValueChange={(val) => handleNumberChange(type.name, val)}
              onFocus={() => setFocusedField(type.name)}
              onBlur={() => handleBlur(type.name)}
            />
          )
        })}
      </div>
    </div>
  )
}

export default BinaryConverter
