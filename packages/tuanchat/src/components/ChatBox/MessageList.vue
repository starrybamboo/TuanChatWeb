<script setup lang="ts">
import { ElScrollbar } from 'element-plus'
import MessageItem from '../Message.vue'
import { ref, nextTick, watch } from 'vue'
import { useRoomStore, useMsgStore } from '@/store'
import type { Message } from '@/services/tuanchat/apis'

const roomStore = useRoomStore()
const msgStore = useMsgStore()
const scrollTop = ref(0)
const innerRef = ref<HTMLDivElement>()
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
const isFetching = ref(false)

const props = defineProps<{
  msgs: Message[]
}>()

const shouldShowAvatar = (currentMsg: Message, index: number) => {
  if (index === 0) return true;
  const prevMsg = props.msgs[index - 1];
  
  return prevMsg.avatarId !== currentMsg.avatarId || 
         prevMsg.roleId !== currentMsg.roleId;
}

watch(
  () => [roomStore.messages.length, roomStore.curRoom?.roomId!],
  (newval, oldval) => {
    nextTick(() => {
      if (
        oldval[1] === newval[1] &&
        newval[0] > oldval[0] &&
        innerRef.value!.clientHeight - scrollTop.value < 1000
      ) {
        scrollbarRef.value!.setScrollTop(innerRef.value!.clientHeight)
      }
      if (oldval[1] !== newval[1]) {
        scrollbarRef.value!.setScrollTop(innerRef.value!.clientHeight)
      }
    })
  }
)

const onScroll = (scroll: { scrollLeft: number; scrollTop: number }) => {
  scrollTop.value = scroll.scrollTop
}

const onWheel = (e: WheelEvent) => {
  if (e.deltaY < 0 && scrollTop.value === 0 && !isFetching.value) {
    isFetching.value = true
    msgStore.fetchMsg(roomStore.curRoom?.roomId!).then(() => {
      isFetching.value = false
    })
  }
}
</script>

<template>
  <ElScrollbar ref="scrollbarRef" @scroll="onScroll">
    <div class="message-list" ref="innerRef" @wheel="onWheel">
      <MessageItem 
        v-for="(msg, index) in msgs" 
        :key="msg.syncId" 
        :msg="msg" 
        :readOnly="false"
        :shouldShowAvatar="shouldShowAvatar(msg, index)"
      />
    </div>
  </ElScrollbar>
</template>

<style scoped>
.message-list {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>
