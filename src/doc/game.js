import { pickBy } from '@/utils'

// 游戏字体配置映射
export const GAME_FONTS = {
  text: 'text',
  top: 'top',
  fontSize: 'fontSize'
}

// 游戏奖品配置映射
export const GAME_PRIZE = {
  background: 'background',
  fonts: ({ fonts }) => {
    // 将单个font对象转换为数组格式
    if (fonts && typeof fonts === 'object' && !Array.isArray(fonts)) {
      return [fonts]
    }
    return fonts || []
  },
  x: 'x', // 九宫格特有属性
  y: 'y' // 九宫格特有属性
}

// 游戏按钮配置映射
export const GAME_BUTTON = {
  radius: 'radius',
  background: 'background',
  pointer: 'pointer',
  shadow: 'shadow',
  x: 'x', // 九宫格特有属性
  y: 'y', // 九宫格特有属性
  fonts: ({ fonts }) => {
    // 将单个font对象转换为数组格式
    if (fonts && typeof fonts === 'object' && !Array.isArray(fonts)) {
      return [fonts]
    }
    return fonts || []
  }
}

// 游戏配置映射 - 扁平化activityConfig，但保留gameConfig
export const GAME_CONFIG = {
  gameType: 'gameType',
  backgroundImage: 'backgroundImage',
  gameMarginTop: 'gameMarginTop',
  gameConfig: ({ gameConfig }) => {
    if (!gameConfig) return {}

    const newGameConfig = { ...gameConfig }

    // 处理prizes中的fonts
    if (newGameConfig.prizes && Array.isArray(newGameConfig.prizes)) {
      newGameConfig.prizes = newGameConfig.prizes?.map((prize) => {
        const newPrize = { ...prize }
        if (
          newPrize.fonts &&
          typeof newPrize.fonts === 'object' &&
          !Array.isArray(newPrize.fonts)
        ) {
          newPrize.fonts = [newPrize.fonts]
        }
        return newPrize
      })
    }

    // 处理buttons中的fonts
    if (newGameConfig.buttons && Array.isArray(newGameConfig.buttons)) {
      newGameConfig.buttons = newGameConfig.buttons?.map((button) => {
        const newButton = { ...button }
        if (
          newButton.fonts &&
          typeof newButton.fonts === 'object' &&
          !Array.isArray(newButton.fonts)
        ) {
          newButton.fonts = [newButton.fonts]
        }
        return newButton
      })
    }
    console.log('newGameConfig----', newGameConfig)
    return newGameConfig
  }
}
