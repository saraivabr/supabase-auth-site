const STORAGE_KEY = 'auth_redirect'

export const getAuthRedirect = () => {
  return sessionStorage.getItem(STORAGE_KEY) || undefined
}

export const setAuthRedirect = (redirect: string) => {
  sessionStorage.setItem(STORAGE_KEY, redirect)
}

export const clearAuthRedirect = () => {
  sessionStorage.removeItem(STORAGE_KEY)
}

/**
 * 验证 referer 是否是有效的外部跳转地址
 * - 必须是有效的 URL
 * - 不能是当前域名的认证相关页面
 */
export const isValidExternalReferer = (referer: string): boolean => {
  if (!referer) return false

  try {
    const refererUrl = new URL(referer)
    const currentOrigin = window.location.origin

    // 如果是同域名
    if (refererUrl.origin === currentOrigin) {
      // 排除认证相关页面
      const authPaths = ['/signin', '/verify-otp', '/callback']
      return !authPaths.some((path) => refererUrl.pathname.startsWith(path))
    }

    // 外部域名，允许
    return true
  } catch {
    return false
  }
}

/**
 * 获取最终的跳转地址
 * 优先级：query 参数 > referer > sessionStorage
 */
export const resolveRedirect = (queryRedirect?: string): string | undefined => {
  // 1. 优先使用 query 参数
  if (queryRedirect) {
    setAuthRedirect(queryRedirect)
    return queryRedirect
  }

  // 2. 尝试使用 referer
  const referer = document.referrer
  if (isValidExternalReferer(referer)) {
    setAuthRedirect(referer)
    return referer
  }

  // 3. 从 sessionStorage 读取
  return getAuthRedirect()
}

/**
 * 执行登录后的跳转
 * - 如果有存储的跳转地址，清除并跳转到该地址
 * - 否则跳转到默认页面 /console/apps
 */
export const performPostLoginRedirect = (
  navigate: (opts: { to: string }) => void,
) => {
  const redirect = getAuthRedirect()
  if (redirect) {
    clearAuthRedirect()
    window.location.href = redirect
  } else {
    navigate({ to: '/' })
  }
}
