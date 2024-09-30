import { defineStore } from 'pinia'
import { ref } from 'vue'
import { tuanApis } from '@/services'
import type { UserRole, RoleAvatar, RoleAbilityTable } from '@/services'

export const useRoleStore = defineStore('role', () => {
  const userRoleList = ref(new Map<number, UserRole>())
  const roleAbility = ref(new Map<number, RoleAbilityTable>())
  const roleToAvatars = ref(new Map<number, number[]>())
  const avatarToUrl = ref(new Map<number, string>())
  const groupToRole = ref(new Map<number, UserRole>())

  async function fetchRoleAvatars(roleId: number) {
    const data = (await tuanApis.getRoleAvatars({ roleId: roleId })).data.data
    if (data === undefined) {
      throw new Error('Role avatars not found')
    }
    data.forEach((avatar: RoleAvatar) => {
      if (avatar.avatarId !== undefined) {
        avatarToUrl.value.set(avatar.avatarId, avatar.avatarUrl!)
      }
    })
    roleToAvatars.value.set(
      roleId,
      data
        .filter((avatar: RoleAvatar) => avatar.avatarId !== undefined)
        .map((avatar: RoleAvatar) => avatar.avatarId!)
    )
  }

  async function fetchAvatar(avatarId: number) {
    const data = (await tuanApis.getRoleAvatar({ avatarId: avatarId })).data.data
    if (data === undefined) {
      throw new Error('Role avatars not found')
    }
    avatarToUrl.value.set(avatarId, data.avatarUrl!)
  }

  async function fetchRole(groupId: number) {
    groupToRole.value.set(groupId, userRoleList.value.values().next().value)
  }

  return {
    userRoleList,
    roleAbility,
    roleToAvatars,
    avatarToUrl,
    groupToRole,
    fetchRole,
    fetchRoleAvatars,
    fetchAvatar
  }
})
