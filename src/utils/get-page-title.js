import defaultSettings from '@/settings'

const title = defaultSettings.title || '浩哲超市库存管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
