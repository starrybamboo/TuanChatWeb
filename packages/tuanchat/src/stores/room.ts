import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useMsgStore } from './message'
import { useGroupStore } from './group'
import { useRoleStore } from './role'
import type { Message, UserRole, RoomGroup } from '@/services'
import { Renderer } from '@/utils/renderer'

export const useRoomStore = defineStore('room', () => {
  const msgStore = useMsgStore()
  const groupStore = useGroupStore()
  const roleStore = useRoleStore()
  // 已缓存的房间列表: roomId -> isGroup(true为群聊,false为私聊)
  const cachedRoomList = ref(new Map<number, boolean>())
  // 当前房间信息
  const curRoom = ref<RoomGroup>()
  // 当前用户在房间中使用的角色
  const role = ref<UserRole>()
  // 当前房间的消息列表
  const messages = ref<Message[]>([])
  // 当前房间的角色列表
  const roleList = ref<UserRole[]>([])
  // 当前房间的渲染器实例
  const renderer = ref<Renderer>(new Renderer(-1))


  // 切换到指定房间
  async function switchRoom(roomId: number) {
    curRoom.value = groupStore.groupList.get(roomId)
    if (!cachedRoomList.value.has(roomId)) {
      await initRoom(roomId)
      //TODO：兼容私聊信息
      cachedRoomList.value.set(roomId, true)
    } else {
      await loadRoom(roomId)
    }
    
    if (curRoom.value) {
      await groupStore.fetchRoles(roomId).then(() => {
        roleList.value = groupStore.groupRoleList.get(roomId)!
        roleList.value.forEach((role) => {
          roleStore.fetchRoleAvatars(role.roleId!).then(() => {})
        })
      })
    }
  }

  // 初始化房间数据
  async function initRoom(roomId: number) {
    groupStore.createRenderer(roomId).then(() => {
      renderer.value = groupStore.renderers.get(roomId)!
    })
    msgStore.fetchMsg(roomId).then(() => {
      messages.value = msgStore.messagesList.get(roomId)!
    })
    groupStore.fetchRoles(roomId).then(() => {
      roleList.value = groupStore.groupRoleList.get(roomId)!
      roleList.value.forEach((role) => {
        roleStore.fetchRoleAvatars(role.roleId!).then(() => {})
      })
    })
    roleStore.fetchRole(roomId).then(() => {
      role.value = roleStore.groupToRole.get(roomId)!
    })
  }

  // 加载已缓存的房间数据
  async function loadRoom(roomId: number) {
    renderer.value = groupStore.renderers.get(roomId)!
    messages.value = msgStore.messagesList.get(roomId)!
    roleList.value = groupStore.groupRoleList.get(roomId)!
    role.value = roleStore.groupToRole.get(roomId)!
  }

  return { curRoom, messages, role, roleList, renderer, switchRoom }
})
