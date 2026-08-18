/**
 * ZTools 微信读书插件 preload。
 *
 * 阅读页直接运行在 ZTools 主窗口的插件内容区。远程微信读书仍位于
 * 隔离的持久化 webview 中，不能访问 Node.js、文件系统或 ZTools API。
 */
;(function initWereadPreload() {
  'use strict'

  const HOME_URL = 'https://weread.qq.com/'
  const STORAGE_KEY = 'weread_reader/lastReaderUrl'
  const DEFAULT_CODE = 'weread'
  const VALID_CODES = new Set(['weread', 'weread_continue', 'weread_shelf'])

  let lastLaunchCode = DEFAULT_CODE

  function ztoolsApi() {
    return window.ztools
  }

  function normalizeWereadUrl(rawUrl) {
    if (typeof rawUrl !== 'string' || rawUrl.length > 4096) return null

    try {
      const url = new URL(rawUrl)
      if (url.protocol !== 'https:') return null
      if (url.hostname !== 'weread.qq.com') return null
      if (url.port || url.username || url.password) return null
      return url.href
    } catch (error) {
      return null
    }
  }

  function normalizeReaderUrl(rawUrl) {
    const allowedUrl = normalizeWereadUrl(rawUrl)
    if (!allowedUrl) return null

    const url = new URL(allowedUrl)
    if (!/^\/web\/reader(?:\/|$)/.test(url.pathname)) return null
    return url.href
  }

  function getSavedReaderUrl() {
    try {
      const saved = ztoolsApi().dbStorage.getItem(STORAGE_KEY)
      const normalized = normalizeReaderUrl(saved)
      if (!normalized && saved) ztoolsApi().dbStorage.removeItem(STORAGE_KEY)
      return normalized
    } catch (error) {
      console.warn('[WeRead] 读取续读地址失败:', error)
      return null
    }
  }

  function saveReaderUrl(rawUrl) {
    const normalized = normalizeReaderUrl(rawUrl)
    if (!normalized) return false

    try {
      ztoolsApi().dbStorage.setItem(STORAGE_KEY, normalized)
      return true
    } catch (error) {
      console.warn('[WeRead] 保存续读地址失败:', error)
      return false
    }
  }

  function getAvailableScreenHeight() {
    try {
      const cursor = ztoolsApi().getCursorScreenPoint()
      const display = ztoolsApi().getDisplayNearestPoint(cursor)
      return (
        display?.workAreaSize?.height ||
        display?.workArea?.height ||
        display?.size?.height ||
        display?.bounds?.height ||
        920
      )
    } catch (error) {
      return 920
    }
  }

  function fitPanelHeight() {
    try {
      const height = Math.max(520, Math.min(620, getAvailableScreenHeight() - 180))
      ztoolsApi().setExpendHeight(height)
    } catch (error) {
      console.warn('[WeRead] 调整主面板高度失败:', error)
    }
  }

  function emitLaunchIntent(code) {
    window.dispatchEvent(
      new CustomEvent('weread:plugin-enter', {
        detail: { code },
      }),
    )
  }

  const bridge = Object.freeze({
    homeUrl: HOME_URL,
    isStandalone: false,
    launchesStandalone: false,

    getLaunchState() {
      return {
        code: lastLaunchCode,
        savedReaderUrl: getSavedReaderUrl(),
      }
    },

    getSavedReaderUrl,
    saveReaderUrl,
    normalizeWereadUrl,

    openInSystemBrowser(rawUrl) {
      const normalized = normalizeWereadUrl(rawUrl)
      if (!normalized) return false
      return Boolean(ztoolsApi().shellOpenExternal(normalized))
    },
  })

  Object.defineProperty(window, 'wereadBridge', {
    value: bridge,
    enumerable: false,
    configurable: false,
    writable: false,
  })

  ztoolsApi().onPluginEnter(function onPluginEnter(param) {
    const requestedCode = typeof param?.code === 'string' ? param.code : DEFAULT_CODE
    lastLaunchCode = VALID_CODES.has(requestedCode) ? requestedCode : DEFAULT_CODE
    fitPanelHeight()
    emitLaunchIntent(lastLaunchCode)
  })

  window.addEventListener('DOMContentLoaded', fitPanelHeight, { once: true })
})()
