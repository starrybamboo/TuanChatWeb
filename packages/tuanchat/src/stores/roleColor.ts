import { defineStore } from 'pinia'

const COLORS = [
  '#FF9999', // 粉红
  '#99FF99', // 浅绿
  '#9999FF', // 浅蓝
  '#FFFF99', // 浅黄
  '#FF99FF', // 粉紫
  '#99FFFF', // 浅青
  '#FFB366', // 橙色
  '#B366FF', // 紫色
  '#66FFB3', // 青绿
  '#66B3FF', // 天蓝
]

export const useRoleColorStore = defineStore('roleColor', {
  state: () => ({
    roleColors: new Map<string, string>()
  }),

  actions: {
    getColorForRole(roleId: string) {
      if (!this.roleColors.has(roleId)) {
        const usedColors = Array.from(this.roleColors.values())
        const availableColors = COLORS.filter(color => !usedColors.includes(color))
        const newColor = availableColors.length > 0 
          ? availableColors[0] 
          : COLORS[this.roleColors.size % COLORS.length]
        
        this.roleColors.set(roleId, newColor)
        // 保存到 localStorage
        localStorage.setItem(`roleColor_${roleId}`, newColor)
      }
      return this.roleColors.get(roleId)
    },

    loadSavedColors() {
      // 从 localStorage 加载保存的颜色
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('roleColor_')) {
          const roleId = key.replace('roleColor_', '')
          const color = localStorage.getItem(key)
          if (color) {
            this.roleColors.set(roleId, color)
          }
        }
      }
    }
  }
}) 