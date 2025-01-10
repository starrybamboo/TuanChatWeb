import { defineStore } from 'pinia'

import type { RoleAvatarRequest } from '@/services/tuanchat/apis'

export const useAvatarStore = defineStore('avatar', {
    state: () => ({
        // avatar_id -> 相关所有的imageId
        imageUrls: new Map<number, RoleAvatarRequest>()
    }),
    
})
