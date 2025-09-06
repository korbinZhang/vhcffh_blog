import { getCustomMDXComponent } from 'rspress/theme'
import { Scanner } from '@yudiel/react-qr-scanner'
import { useState } from 'react'

export const frontmatter = {
  date: '2025-08-23',
  description: '在线扫描二维码, 二维码扫描',
  title: '在线扫描二维码',
}

const Main = () => {
  const MDXComponents = getCustomMDXComponent()
  const [scanText, setScanText] = useState('扫描结果-点击复制')
  return (
    <>
      <MDXComponents.h1>{frontmatter.title}</MDXComponents.h1>
      <button
        className="w-full text-left"
        onClick={() => {
          navigator.clipboard.writeText(scanText)
          alert(`复制成功`)
        }}
        style={{
          border: '2px solid',
          borderColor: 'skyblue',
          borderRadius: '5px',
        }}
      >
        {scanText}
      </button>

      <div className="w-9/12 mx-auto mt-10 min-w-96">
        <Scanner onScan={(r) => setScanText(r[0].rawValue)} />
      </div>
    </>
  )
}

export default Main
