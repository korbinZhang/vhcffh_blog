import React from 'react'
import { Row, Col, Button, Popover } from 'antd'

const colors = [
  ['Red', '#FF0000', 'black', '红色'],
  ['Orange', '#FFA500', 'black', '橙色'],
  ['Yellow', '#FFFF00', 'black', '黄色'],
  ['Green', '#008000', 'black', '绿色'],
  ['Blue', '#0000FF', 'white', '蓝色'],
  ['Purple', '#800080', 'white', '紫色'],
  ['Pink', '#FFC0CB', 'black', '粉红色'],
  ['Brown', '#A52A2A', 'white', '棕色'],
  ['Black', '#000000', 'white', '黑色'],
  ['White', '#FFFFFF', 'black', '白色'],
  ['Grey', '#808080', 'black', '灰色'],
  ['Cyan', '#00FFFF', 'black', '青色'],
  ['Magenta', '#FF00FF', 'black', '品红色'],
  ['Turquoise', '#40E0D0', 'black', '青绿色'],
  ['Violet', '#EE82EE', 'black', '紫罗兰色'],
  ['Maroon', '#800000', 'white', '栗色'],
  ['Navy', '#000080', 'white', '海军蓝'],
  ['Beige', '#F5F5DC', 'black', '米色'],
  ['Teal', '#008080', 'black', '水鸭色'],
  ['Lavender', '#E6E6FA', 'black', '浅紫色'],
  ['Peach', '#FFDAB9', 'black', '桃色'],
  ['Mint', '#98FF98', 'black', '薄荷色'],
  ['Salmon', '#FA8072', 'black', '鲑鱼色'],
  ['Gold', '#FFD700', 'black', '金色'],
  ['Silver', '#C0C0C0', 'black', '银色'],
  ['Olive', '#808000', 'black', '橄榄绿'],
  ['Amber', '#FFBF00', 'black', '琥珀色'],
  ['Charcoal', '#36454F', 'white', '木炭色'],
  ['Ivory', '#FFFFF0', 'black', '象牙色'],
  ['Rust', '#B7410E', 'black', '铁锈色'],
  ['Chestnut', '#954535', 'black', '栗棕色'],
  ['Light', '#FFFFFF', 'black', '浅'],
  ['Dark', '#000000', 'white', '深'],
  ['Bright', '#FFFFFF', 'black', '明亮'],
  ['Pastel', '#000000', 'white', '柔和'],
]
const playWord = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
  const color = e.currentTarget.dataset.color as string
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(color))
}

export const ColorCards = () => (
  <Row gutter={[16, 16]}>
    {colors.map((c) => (
      <Col key={c[0]} span={4}>
        <Popover title="" content={c[3]} trigger="hover">
          <Button
            block
            data-color={c[0]}
            size="large"
            style={{
              color: c[2],
              background: c[1],
            }}
            onClick={playWord}
          >
            {c[0]}
          </Button>
        </Popover>
      </Col>
    ))}
  </Row>
)

export default ColorCards
