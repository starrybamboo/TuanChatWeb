import { defineStore } from 'pinia'
import { ref } from 'vue'
import { tuanApis } from '@/services'
import type { UserRole, RoleAvatar, RoleAbilityTable } from '@/services'

export const useRoleStore = defineStore('role', () => {
  // role_id -> 角色的具体信息
  const userRoleList = ref(new Map<number, UserRole>())
  // role_id -> 角色的属性列表
  const roleAbility = ref(new Map<number, RoleAbilityTable>())
  // role_id -> 相关所属的所有 avatar_id
  const roleToImages = ref(new Map<number, number[]>())
  // avatar_id -> 相关所有的imageId
  const imageUrls = ref(
    new Map<number, { spriteUrl: string; avatarUrl: string; avatarTitle: string }>()
  )

  // 一个群里面的相关所有角色
  // room_id -> role_id 
  const groupToRole = ref(new Map<number, UserRole>())

  async function fetchRoleAvatars(roleId: number) {
    const data = (await tuanApis.getRoleAvatars({ roleId: roleId })).data.data
    if (data === undefined) {
      throw new Error('Role avatars not found')
    }
    data.forEach((avatar: RoleAvatar) => {
      if (avatar.avatarId !== undefined) {
        imageUrls.value.set(avatar.avatarId, {
          spriteUrl: avatar.spriteUrl!,
          avatarUrl: avatar.avatarUrl!,
          avatarTitle: avatar.avatarTitle!
        })
      }
    })
    roleToImages.value.set(
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
    imageUrls.value.set(avatarId, {
      spriteUrl: data.spriteUrl!,
      avatarUrl: data.avatarUrl!,
      avatarTitle: data.avatarTitle!
    })
  }

  async function fetchRole(groupId: number) {
    
    groupToRole.value.set(groupId, userRoleList.value.values().next().value!)
  }

  async function addRole() {
    const newRole = (await tuanApis.createRole()).data.data
    if (newRole === undefined) {
      throw new Error('Create role failed')
    }
    userRoleList.value.set(newRole.roleId!, newRole)
    tuanApis.getRoleAbility({ roleId: newRole.roleId! }).then((res) => {
      if (res.data.data === undefined) {
        throw new Error('Role ability not found')
      }
      roleAbility.value.set(newRole.roleId!, res.data.data)
    })
  }

  function deleteRole(roleId: number) {
    tuanApis.deleteRole({ roleId: roleId }).then(() => {
      userRoleList.value.delete(roleId)
      roleAbility.value.delete(roleId)
    })
  }

  return {
    userRoleList,
    roleAbility,
    roleToImages,
    imageUrls,
    groupToRole,
    addRole,
    fetchRole,
    fetchRoleAvatars,
    fetchAvatar,
    deleteRole
  }
})
