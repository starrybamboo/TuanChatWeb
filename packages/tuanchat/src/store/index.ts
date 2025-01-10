import { createPinia } from 'pinia'
import { useUserStore } from './character/user/user'
import { useMsgStore } from './chat/message/message'
import { useGroupStore } from './chat/room/group'
import { useRoomStore } from './chat/room/room'
import { useRoleStore } from './character/role/role'

const pinia = createPinia()

export default pinia
export { useUserStore, useMsgStore, useGroupStore, useRoomStore, useRoleStore }
