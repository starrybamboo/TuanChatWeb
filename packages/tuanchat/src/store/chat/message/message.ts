import { ref } from 'vue'
import { defineStore } from 'pinia'
import { tuanApis } from '@/services'
import type { Message } from '@/services'
import type { WsReqType } from '@/utils/websocket/types'
import { parseInstruction } from '@/utils/parser'

import wsIns from '@/utils/websocket/websocket'

// 这是一次请求获取的消息数量
const pageSize = 10

export const useMsgStore = defineStore('chat', () => {
  // 一个本地的消息缓存存储
  const messagesList = ref<Map<number, Message[]>>(new Map<number, Message[]>())
  // 每个群的游标的位置
  const cursorMap = new Map<number, string>()
  // 是否加载完所有历史消息: roomId -> boolean
  const isLoaded = new Map<number, boolean>()
  // 引入websocket
  const ws = wsIns

  // 添加新消息到列表
  function pushMsg(msg: Message) {
    const roomId = msg.roomId!
    if (messagesList.value.has(roomId)) {
      messagesList.value.get(roomId)?.push(msg)
    } else {
      fetchMsg(roomId, pageSize).then(() => {
        messagesList.value.get(roomId)?.push(msg)
      })
    }
  }

  // 获取历史消息
  async function fetchMsg(roomId: number, size: number = pageSize) {
    if (isLoaded.get(roomId)) { 
      alert("没有更多消息了")
      return 
    }

    const data = (
      await tuanApis.getMsgPage({
        pageSize: size,
        roomId: roomId,
        cursor: cursorMap.get(roomId) || undefined
      })
    ).data.data
    if (data === undefined) {
      throw new Error('Fetch message failed')
    }
    if (data.isLast) {
      isLoaded.set(roomId, true)
    }

    const msgs = data.list!.map((msg) => msg.message).filter((item) => item !== undefined)

    if (msgs.length > 0) {
      cursorMap.set(roomId, data.cursor!)
      if (messagesList.value.has(roomId)) {
        messagesList.value.get(roomId)?.unshift(...msgs)
      } else {
        messagesList.value.set(roomId, msgs)
      }
    } else {
      messagesList.value.set(roomId, [])
    }

    cursorMap.set(roomId, data.cursor!)
  }

  // 通过websocket 发送新消息
  function sendMsg(msg: string, roomId: number, roleId: number, avatarId: number) {
    const parsedMsg = parseInstruction(msg)
    const wsReq: WsReqType = {
      type: 3,
      data: {
        roomId: roomId,
        roleId: roleId,
        avatarId: avatarId,
        msgType: 1,
        body: {
          content: parsedMsg
        }
      }
    }
    ws.send(wsReq)
  }

  return { messagesList, pushMsg, fetchMsg, sendMsg }
})
