import config from '@/config'
const uploadUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev + 'upload' : config.baseUrl.pro + 'upload'

export default uploadUrl