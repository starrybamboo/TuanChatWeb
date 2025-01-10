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

// 为每个角色分配独特的显示颜色,并持久化保存
export const useRoleColorStore = defineStore('roleColor', {
  
  state: () => ({
    // role_id -> 颜色的映射
    roleColors: new Map<number, string>() 
  }),

  actions: {
    // 获取或分配角色的颜色
    getColorForRole(roleId: number) {
      // 如果 roleId 没有对应的color
      if (!this.roleColors.has(roleId)) {
        // 确保每个角色都有独特的显示颜色， 优先使用未被分配的颜色
        // 当颜色用完时，循环使用预设颜色， 避免相邻角色使用相同颜色，提高可读性

        const usedColors = Array.from(this.roleColors.values())
        const availableColors = COLORS.filter(color => !usedColors.includes(color))
  
        const newColor = availableColors.length > 0 ? availableColors[0] : COLORS[this.roleColors.size % COLORS.length]
        
        this.roleColors.set(roleId, newColor)

        // 保存到 localStorage，在页面刷新后可以恢复之前的颜色分配，保持用户体验的一致性
        localStorage.setItem(`roleColor_${roleId}`, newColor)
      }

      return this.roleColors.get(roleId)
    },

    // 从localStorage加载已保存的颜色配置
    loadSavedColors() {
      // 从 localStorage 加载保存的颜色
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('roleColor_')) {
          const roleId = key.replace('roleColor_', '')
          const color = localStorage.getItem(key)
          if (color) {
            this.roleColors.set(Number(roleId), color)
          }
        }
      }
    }
  }
}) 