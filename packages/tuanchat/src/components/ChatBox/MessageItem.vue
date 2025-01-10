<script setup lang="ts">
import { ElAvatar, ElButton, ElText } from 'element-plus'
import { MsgEnum } from '@/enums'
import { useRoleStore } from '@/stores/role'
import { useRoomStore } from '@/stores'
import type { TextBody } from '@/stores/types'
import type { Message } from '@/services'
import { computed } from 'vue'
import { useRoleColorStore } from '@/stores/roleColor'

const props = defineProps<{
  msg: Message
  readOnly: boolean
  shouldShowAvatar: boolean
}>()

const roleStore = useRoleStore()
const roomStore = useRoomStore()
const msgType: MsgEnum = props.msg.messageType!
const role = computed(() => roleStore.userRoleList.get(props.msg.roleId!)!)
const renderer = roomStore.renderer!
const roleColorStore = useRoleColorStore()
const textColor = computed(() => role.value ? roleColorStore.getColorForRole(String(role.value.roleId!)) : '#FFFFFF')


// 这个是跟 webgal 联动的地方。
const handleAddToRenderer = async () => {
  const spriteUrl = roleStore.imageUrls.get(props.msg.avatarId!)?.spriteUrl
  await renderer.uploadSprites(
    spriteUrl!,
    `role_${role.value?.roleId}_sprites_${props.msg.avatarId}`
  )
  renderer.addDialog(
    role.value.roleId!,
    role.value.roleName!,
    props.msg.avatarId!,
    (props.msg.body as TextBody).content
  )
  renderer.asycRender()
}
</script>

<template>
  <div class="vn-message-box">
    <!-- 旁白文本 -->
    <div v-if="!role" class="narration">
      {{ (msg.body as TextBody).content }}
    </div>
    
    <!-- 对话文本 -->
    <div v-else class="dialog-container" :class="{ 'merged': !shouldShowAvatar }">
      
      <div v-if="shouldShowAvatar" class="avatar-container">
        <ElAvatar
          :size="80"
          shape="square"
          fit="cover"
          :src="roleStore.imageUrls.get(props.msg.avatarId!)?.avatarUrl"
          class="avatar-with-transparent-bg"
        />
      </div>
      
      <div class="message-content">
        <div v-if="shouldShowAvatar" class="character-name" :style="{ color: textColor }">
          【{{ role?.roleName }}】
        </div>
        <div class="dialog-content" :style="{ color: textColor }">
          「{{ (msg.body as TextBody).content }}」
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vn-message-box {
  margin: 4px 0;
  font-family: "SimHei", "Microsoft YaHei", sans-serif;
}

.narration {
  padding: 10px;
  color: #fff;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  font-size: 16px;
}

.dialog-container {
  display: flex;
  gap: 15px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(67, 83, 102, 0.5);
  border-radius: 8px;
  margin-left: 95px;
}

.dialog-container:not(.merged) {
  margin-left: 0;
}

.avatar-container {
  flex-shrink: 0;
}

.message-content {
  flex: 1;
}

.character-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.dialog-content {
  font-size: 18px;
  line-height: 1.5;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.avatar-with-transparent-bg {
  background: transparent !important;
  border: 2px solid rgba(67, 83, 102, 0.8);
}

/* 合并消息时的样式 */
.merged {
  margin-top: -2px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.merged + .dialog-container {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
</style>
