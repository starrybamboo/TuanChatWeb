<script setup lang="ts">
import { ElAvatar, ElButton, ElText } from 'element-plus'
import { MsgEnum } from '@/enums'
import { useRoleStore } from '@/store/character/role/role'
import { useRoomStore } from '@/store'
import type { TextBody } from '@/store/type/types'
import type { Message } from '@/services'
import { computed, ref } from 'vue'
import { useRoleColorStore } from '@/store/character/role/roleColor'

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
const textColor = computed(() => role.value ? roleColorStore.getColorForRole(role.value.roleId!) : '#FFFFFF')

const showAvatarSelect = ref(false)

const handleAvatarClick = () => {
  if (!props.readOnly) {
    showAvatarSelect.value = !showAvatarSelect.value
  }
}

const handleAvatarChange = async (newAvatarId: number) => {
  showAvatarSelect.value = false
  if (newAvatarId !== props.msg.avatarId) {
    try {
      alert("更新了以前消息的头像")
      // await messageStore.updateMessageAvatar(props.msg.id!, newAvatarId)
      // 可以添加成功提示
    } catch (error) {
      console.error('Failed to update avatar:', error)
      // 可以添加错误提示
    }
  }
}

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

const editingContent = ref('')
const isEditing = ref(false)

const startEditing = () => {
  if (!props.readOnly) {
    editingContent.value = (props.msg.body as TextBody).content
    isEditing.value = true
  }
}

const handleUpdateContent = async () => {
  if (editingContent.value !== (props.msg.body as TextBody).content) {
    try {
      alert("修改了以前消息的内容")
      // await messageStore.updateMessageContent(props.msg.id!, editingContent.value)
    } catch (error) {
      console.error('Failed to update message:', error)
    }
  }
  isEditing.value = false
}
</script>

<template>
  <div class="vn-message-box">
    <!-- 旁白文本 -->
    <div v-if="msg.messageType == MsgEnum.UNKNOWN" class="narration">
      {{ (msg.body as TextBody).content }}
    </div>
    
    <!-- 对话文本 -->
    <div v-else class="dialog-container" :class="{ 'merged': !shouldShowAvatar }">
      
      <div v-if="shouldShowAvatar" class="avatar-container">
        <div class="avatar-wrapper" @click="handleAvatarClick">
          <ElAvatar
            :size="100"
            shape="square"
            fit="cover"
            :src="roleStore.imageUrls.get(props.msg.avatarId!)?.avatarUrl"
            class="avatar-with-transparent-bg"
          />
        </div>
      </div>
      
      <div v-if="!readOnly && showAvatarSelect" class="avatar-list">
          <div
            v-for="item in roleStore.roleToImages.get(msg.roleId!)"
            :key="item"
            class="avatar-option"
            @click="handleAvatarChange(item)"
          >
            <ElAvatar
              :size="60"
              shape="square"
              fit="cover"
              :src="roleStore.imageUrls.get(item)?.avatarUrl"
            />
          </div>
        </div>
      
      <div class="message-content">
        <div v-if="shouldShowAvatar" class="character-name" :style="{ color: textColor }">
          【{{ role?.roleName }}】
        </div>
        <div class="dialog-content" :style="{ color: textColor }">
          <div v-if="!isEditing" @click="startEditing">
            「{{ (msg.body as TextBody).content }}」
          </div>
          <div v-else class="editing-container">
            <el-input
              v-model="editingContent"
              type="textarea"
              :rows="2"
              @blur="handleUpdateContent"
              @keyup.enter="handleUpdateContent"
              autofocus
            />
          </div>
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
  margin-left: 115px;
}

.dialog-container:not(.merged) {
  margin-left: 0;
}

.avatar-container {
  flex-shrink: 0;
  position: relative;
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

.avatar-wrapper {
  position: relative;
  cursor: pointer;
}

.avatar-wrapper:hover::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.avatar-list {
  position: absolute;
  z-index: 99999;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 8px;
  border: 1px solid rgba(67, 83, 102, 0.8);
  margin-top: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  left: 0;
}

.avatar-option {
  cursor: pointer;
  transition: all 0.2s ease;
}

.avatar-option :deep(.el-avatar) {
  width: 100px !important;
  height: 100px !important;
  border: 2px solid transparent;
}

.avatar-option:hover {
  transform: scale(1.05);
}

.avatar-option:hover :deep(.el-avatar) {
  border-color: rgba(255, 255, 255, 0.5);
}

.editing-container {
  margin: 5px 0;
}

.editing-container :deep(.el-textarea__inner) {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(67, 83, 102, 0.8);
  color: inherit;
  font-size: inherit;
}
</style>
