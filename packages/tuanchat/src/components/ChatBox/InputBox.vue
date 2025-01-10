<script setup lang="ts">
import { ElButton, ElAvatar } from 'element-plus'
import { ref, computed } from 'vue'
import { Promotion } from '@element-plus/icons-vue'
import { useMsgStore, useRoomStore, useRoleStore} from '@/store'
import { useRoleColorStore } from '@/store/character/role/roleColor'


const message = ref('')
const msgStore = useMsgStore()
const roomStore = useRoomStore()
const roleStore = useRoleStore()
const roleColorStore = useRoleColorStore()
const usedAvatar = ref<number>(1)
const showAvatarSelect = ref(false)

const textColor = computed(() => 
  roleStore.userRoleList.get(roomStore.role?.roleId!)
    ? roleColorStore.getColorForRole(roomStore.role?.roleId!)
    : '#FFFFFF'
)

const handleAvatarClick = () => {
  showAvatarSelect.value = !showAvatarSelect.value
}

const handleAvatarChange = (newAvatarId: number) => {
  usedAvatar.value = newAvatarId
  showAvatarSelect.value = false
}

const sendMessage = () => {
  if (message.value.trim() === '') return
  msgStore.sendMsg(
    message.value,
    roomStore.curRoom?.roomId!,
    roomStore.role?.roleId!,
    usedAvatar.value
  )
  message.value = ''
}
</script>

<template>
  <div class="dialog-container">
    <div class="avatar-container">
      <div class="avatar-wrapper" @click="handleAvatarClick">
        <ElAvatar
          :size="100"
          shape="square"
          fit="cover"
          :src="roleStore.imageUrls.get(usedAvatar)?.avatarUrl"
          class="avatar-with-transparent-bg"
        />
      </div>
      
      <div v-if="showAvatarSelect" class="avatar-list">
        <div
          v-for="item in roleStore.roleToImages.get(roomStore.role?.roleId!)"
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
    </div>

    <div class="message-content">
      <div class="character-name" :style="{ color: textColor }">
        【{{ roleStore.userRoleList.get(roomStore.role?.roleId!)?.roleName }}】
      </div>
      <div class="dialog-content" :style="{ color: textColor }">
        <div class="editing-container">
          <el-input
            v-model="message"
            type="textarea"
            :rows="2"
            resize="none"
            @keyup.enter="sendMessage"
            placeholder="输入消息..."
          >
            <template #append>
              <ElButton :icon="Promotion" @click="sendMessage" :disabled="message.trim() === ''" />
            </template>
          </el-input>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog-container {
  display: flex;
  gap: 15px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(67, 83, 102, 0.5);
  border-radius: 8px;
  overflow: hidden;
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
  position: fixed;
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
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
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
  color: #fff;
  font-size: 18px;
  font-family: "SimHei", "Microsoft YaHei", sans-serif;
  line-height: 1.5;
  padding: 8px 12px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.editing-container :deep(.el-input-group__append) {
  background: transparent;
  border: 1px solid rgba(67, 83, 102, 0.8);
  padding: 0 12px;
}

.editing-container :deep(.el-button) {
  background: transparent;
  border: none;
  color: #fff;
}

.editing-container :deep(.el-button:hover) {
  background: rgba(255, 255, 255, 0.1);
}

.editing-container :deep(.el-button.is-disabled) {
  color: rgba(255, 255, 255, 0.4);
}
</style>
