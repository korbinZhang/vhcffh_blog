import React from 'react'
import { Button, Image, Flex } from 'antd'

export const RandomFace = () => {
  return (
    <Flex vertical={true} gap="large" align="center">
      <Button
        type="primary"
        size="large"
        onClick={() => window.location.reload()}
      >
        随机
      </Button>
      <Image
        width={400}
        src="https://100k-faces.glitch.me/random-image"
      ></Image>
    </Flex>
  )
}

export default RandomFace
