import { useUserStore, useMsgStore } from '@/store'
import { WsRespEnum } from '@/enums'
import type { WsReqType } from './types'
import type { MsgType } from '@/store/types'
import pinia from '@/store'

const worker: Worker = new Worker(new URL('./worker.ts', import.meta.url), {
  type: 'module'
})

class WS {
  #tasks: WsReqType[] = []
  #connectReady = false

  constructor() {
    worker.onmessage = this.#onWorkerMsg
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !this.#connectReady) {
        this.initConnect()
      }
    })
  }

  initConnect = () => {
    worker.postMessage(JSON.stringify({ type: 'initWS', value: useUserStore(pinia).token }))
  }

  send = (req: WsReqType) => {
    if (this.#connectReady) {
      this.#send(req)
    } else {
      this.#tasks.push(req)
    }
  }

  #onWorkerMsg = (e: MessageEvent<any>) => {
    const workMsg: { type: string; value: unknown } = JSON.parse(e.data)
    switch (workMsg.type) {
      case 'message': {
        this.#onMessage(workMsg.value as string)
        break
      }
      case 'open': {
        this.#dealTasks()
        break
      }
      case 'close':
      case 'error': {
        this.#onClose()
        break
      }
    }
  }

  // 收到消息回调
  #onMessage = (value: string) => {
    const wsResp: { type: WsRespEnum; data: { message: MsgType } } = JSON.parse(value)
    const msgStore = useMsgStore(pinia)
    switch (wsResp.type) {
      case WsRespEnum.MESSAGE: {
        msgStore.pushMsg(wsResp.data.message)
        break
      }
      default: {
        console.log('接收到未处理类型的消息:', wsResp)
        break
      }
    }
  }

  // 重置一些属性
  #onClose = () => {
    this.#connectReady = false
  }

  #dealTasks = () => {
    this.#connectReady = true
    setTimeout(() => {
      const userStore = useUserStore(pinia)
      if (userStore.isSign) {
        // 处理堆积的任务
        this.#tasks.forEach((task) => {
          this.send(task)
        })
        // 清空缓存的消息
        this.#tasks = []
      }
    }, 500)
  }

  #send(msg: WsReqType) {
    worker.postMessage(JSON.stringify({ type: 'message', value: msg }))
  }
}

export default new WS()
