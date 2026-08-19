;(function initWereadRenderer() {
  'use strict'

  const bridge = window.wereadBridge
  const HOME_URL = bridge.homeUrl
  const LOAD_ABORTED = -3
  let hostUsesDarkColors = bridge.isDarkColors()
  document.documentElement.classList.toggle('is-standalone-window', Boolean(bridge.isStandalone))
  document.documentElement.dataset.theme = hostUsesDarkColors ? 'dark' : 'light'
  function buildCleanReaderCss(readerUsesDarkColors) {
    return `
    html:has(body.wr_page_reader) {
      background-color: transparent !important;
      background-image: none !important;
      color-scheme: ${readerUsesDarkColors ? 'dark' : 'light'} !important;
      --ztools-reader-text: ${readerUsesDarkColors ? '#ffffff' : '#000000'};
      --ztools-reader-heading: ${readerUsesDarkColors ? '#ffffff' : '#000000'};
      --ztools-reader-muted: ${readerUsesDarkColors ? '#ffffff' : '#000000'};
    }

    body.wr_page_reader,
    body.wr_page_reader #app,
    body.wr_page_reader #routerView,
    body.wr_page_reader .wr_horizontalReader,
    body.wr_page_reader .wr_horizontalReader_app_content,
    body.wr_page_reader .readerContent,
    body.wr_page_reader .app_content,
    body.wr_page_reader .readerChapterContent_container,
    body.wr_page_reader .readerChapterContent,
    body.wr_page_reader .renderTargetContainer {
      background-color: transparent !important;
      background-image: none !important;
      opacity: 1 !important;
      filter: none !important;
      mix-blend-mode: normal !important;
    }

    body.wr_page_reader::before,
    body.wr_page_reader::after,
    body.wr_page_reader #app::before,
    body.wr_page_reader #app::after,
    body.wr_page_reader .readerContent::before,
    body.wr_page_reader .readerContent::after,
    body.wr_page_reader .app_content::before,
    body.wr_page_reader .app_content::after,
    body.wr_page_reader .readerChapterContent::before,
    body.wr_page_reader .readerChapterContent::after {
      background: transparent !important;
      background-image: none !important;
    }

    html:has(body.wr_page_reader),
    body.wr_page_reader,
    body.wr_page_reader #app,
    body.wr_page_reader #routerView,
    body.wr_page_reader .readerContent,
    body.wr_page_reader .app_content,
    body.wr_page_reader .readerChapterContent_container,
    body.wr_page_reader .readerChapterContent,
    body.wr_page_reader .renderTargetContainer {
      -ms-overflow-style: none !important;
      scrollbar-width: none !important;
    }

    html:has(body.wr_page_reader)::-webkit-scrollbar,
    body.wr_page_reader::-webkit-scrollbar,
    body.wr_page_reader *::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
    }

    body.wr_page_reader .readerTopBar,
    body.wr_page_reader .wr_reader_float_corner_bookmark_wrapper {
      display: none !important;
    }

    body.wr_page_reader:has(.wr_horizontalReader) .readerChapterContent {
      box-sizing: border-box !important;
      width: calc(100vw - 24px) !important;
      max-width: none !important;
      height: calc(100vh - 16px) !important;
      margin: 8px 12px 0 !important;
    }

    body.wr_page_reader:not(:has(.wr_horizontalReader)) .app_content {
      box-sizing: border-box !important;
      width: 100% !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 12px !important;
    }

    body.wr_page_reader:not(:has(.wr_horizontalReader)) .navBarOffset {
      height: 20px !important;
      padding-top: 20px !important;
    }

    body.wr_page_reader .app_content,
    body.wr_page_reader .app_content *,
    body.wr_page_reader .readerChapterContent,
    body.wr_page_reader .readerChapterContent * {
      color: var(--ztools-reader-text) !important;
      -webkit-text-fill-color: var(--ztools-reader-text) !important;
      opacity: 1 !important;
      filter: none !important;
      mix-blend-mode: normal !important;
      text-shadow: none !important;
    }

    body.wr_page_reader .readerChapterContent h1,
    body.wr_page_reader .readerChapterContent h2,
    body.wr_page_reader .readerChapterContent h3,
    body.wr_page_reader .readerChapterContent h1 *,
    body.wr_page_reader .readerChapterContent h2 *,
    body.wr_page_reader .readerChapterContent h3 * {
      color: var(--ztools-reader-heading) !important;
      -webkit-text-fill-color: var(--ztools-reader-heading) !important;
      opacity: 1 !important;
    }

    body.wr_page_reader .readerContentHeader,
    body.wr_page_reader .readerContentHeader *,
    body.wr_page_reader .readerFooter,
    body.wr_page_reader .readerFooter * {
      color: var(--ztools-reader-muted) !important;
      -webkit-text-fill-color: var(--ztools-reader-muted) !important;
      opacity: 1 !important;
      filter: none !important;
      text-shadow: none !important;
    }

    body.wr_page_reader .app_content *::before,
    body.wr_page_reader .app_content *::after,
    body.wr_page_reader .readerChapterContent *::before,
    body.wr_page_reader .readerChapterContent *::after,
    body.wr_page_reader .readerContentHeader *::before,
    body.wr_page_reader .readerContentHeader *::after,
    body.wr_page_reader .readerFooter *::before,
    body.wr_page_reader .readerFooter *::after {
      color: var(--ztools-reader-text) !important;
      -webkit-text-fill-color: var(--ztools-reader-text) !important;
      opacity: 1 !important;
      text-shadow: none !important;
    }

    /* 横向阅读的正文由微信读书绘制到 canvas，普通文字颜色规则不会生效。 */
    body.wr_page_reader .wr_canvasContainer canvas {
      opacity: 1 !important;
      filter: ${readerUsesDarkColors ? 'brightness(0) invert(1)' : 'brightness(0)'} !important;
      mix-blend-mode: normal !important;
    }

    body.wr_page_reader .readerControls {
      position: fixed !important;
      top: 8px !important;
      bottom: auto !important;
      right: 8px !important;
      left: auto !important;
      width: 1px !important;
      height: 1px !important;
      min-height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      gap: 0 !important;
      border: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      box-sizing: border-box !important;
      transform: none !important;
      overflow: visible !important;
    }

    body.wr_page_reader .readerControls > .wr_tooltip_container,
    body.wr_page_reader .readerControls > .reader-font-control-panel-wrapper > .wr_tooltip_container {
      visibility: hidden !important;
      width: 1px !important;
      height: 1px !important;
      min-height: 1px !important;
      flex: 0 0 1px !important;
      margin: 0 !important;
      pointer-events: none !important;
    }

    body.wr_page_reader .readerControls > .reader-font-control-panel-wrapper {
      width: 1px !important;
      height: 1px !important;
      min-height: 1px !important;
      flex: 0 0 1px !important;
      overflow: visible !important;
    }

    body.wr_page_reader.ztools-reader-menu-open .readerControls {
      top: 258px !important;
      right: 8px !important;
      width: 154px !important;
      height: auto !important;
      padding: 6px !important;
      gap: 2px !important;
      border: 1px solid rgba(255, 255, 255, 0.14) !important;
      border-radius: 10px !important;
      background: rgba(28, 28, 28, 0.9) !important;
      box-shadow: 0 16px 44px rgba(0, 0, 0, 0.36) !important;
      -webkit-backdrop-filter: blur(26px) saturate(0.86) !important;
      backdrop-filter: blur(26px) saturate(0.86) !important;
    }

    body.wr_page_reader.ztools-reader-menu-open .readerControls > .wr_tooltip_container,
    body.wr_page_reader.ztools-reader-menu-open .readerControls > .reader-font-control-panel-wrapper,
    body.wr_page_reader.ztools-reader-menu-open .readerControls > .reader-font-control-panel-wrapper > .wr_tooltip_container {
      visibility: visible !important;
      width: 142px !important;
      height: 30px !important;
      min-height: 30px !important;
      flex: 0 0 30px !important;
      margin: 0 !important;
      pointer-events: auto !important;
    }

    body.wr_page_reader.ztools-reader-menu-open .readerControls_item {
      display: flex !important;
      align-items: center !important;
      justify-content: flex-start !important;
      width: 142px !important;
      height: 30px !important;
      min-height: 30px !important;
      padding: 0 8px !important;
      border: 1px solid transparent !important;
      border-radius: 6px !important;
      background: transparent !important;
      color: #f3f3f3 !important;
      box-sizing: border-box !important;
    }

    /* 阅读正文会按主题强制纯黑或纯白；深色工具浮层必须单独恢复为白字。 */
    body.wr_page_reader.ztools-reader-menu-open .readerControls_item,
    body.wr_page_reader.ztools-reader-menu-open .readerControls_item *,
    body.wr_page_reader.ztools-reader-menu-open .readerControls_item::before,
    body.wr_page_reader.ztools-reader-menu-open .readerControls_item::after {
      color: #ffffff !important;
      -webkit-text-fill-color: #ffffff !important;
      opacity: 1 !important;
      text-shadow: none !important;
    }

    body.wr_page_reader.ztools-reader-menu-open .readerControls_item:hover {
      border-color: rgba(255, 255, 255, 0.14) !important;
      background: rgba(255, 255, 255, 0.09) !important;
    }

    body.wr_page_reader.ztools-reader-menu-open .readerControls_item .icon,
    body.wr_page_reader.ztools-reader-menu-open .readerControls_item svg {
      flex: 0 0 30px !important;
      width: 30px !important;
      height: 30px !important;
      margin-right: 5px !important;
      opacity: 1 !important;
      filter: brightness(0) invert(1) !important;
    }

    body.wr_page_reader.ztools-reader-menu-open .readerControls_item::after {
      color: #ffffff !important;
      -webkit-text-fill-color: #ffffff !important;
      font: 13px/1.2 "Segoe UI", "Microsoft YaHei UI", sans-serif !important;
      white-space: nowrap !important;
    }

    body.wr_page_reader.ztools-reader-menu-open .readerControls_item.catalog::after { content: "目录"; }
    body.wr_page_reader.ztools-reader-menu-open .readerControls > .wr_tooltip_container:nth-child(2) .readerControls_item::after { content: "AI 问书"; }
    body.wr_page_reader.ztools-reader-menu-open .readerControls_item.wr_note::after { content: "笔记"; }
    body.wr_page_reader.ztools-reader-menu-open .readerControls_item.isHorizontalReader::after { content: "上下滚动阅读"; }
    body.wr_page_reader.ztools-reader-menu-open .readerControls_item.isNormalReader::after { content: "双栏阅读"; }
    body.wr_page_reader.ztools-reader-menu-open .readerControls_item.fontSizeButton::after { content: "字号与字体"; }
    body.wr_page_reader.ztools-reader-menu-open .readerControls_item.white::after { content: "浅色"; }
    body.wr_page_reader.ztools-reader-menu-open .readerControls_item.dark::after { content: "深色"; }
  `
  }

  const webview = document.getElementById('readerWebview')
  const loadingOverlay = document.getElementById('loadingOverlay')
  const errorOverlay = document.getElementById('errorOverlay')
  const errorMessage = document.getElementById('errorMessage')
  const statusText = document.getElementById('statusText')
  const backButton = document.getElementById('backButton')
  const cleanModeButton = document.getElementById('cleanModeButton')
  const menuButton = document.getElementById('menuButton')
  const menuPanel = document.getElementById('menuPanel')

  let initialNavigationDone = false
  let didAutoFallback = false
  let lastRequestedUrl = HOME_URL
  let lastKnownUrl = HOME_URL
  let cleanReaderEnabled = true
  let activeReaderStyleKey = null
  let readerStyleApplying = false
  let readerStyleNeedsRefresh = false
  let readerThemeRequestId = 0
  let readerThemeRequestInFlight = false
  let hostThemeReconcileTimer = null

  function setStatus(message) {
    statusText.textContent = message
  }

  async function syncHostTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') return

    hostUsesDarkColors = theme === 'dark'
    document.documentElement.dataset.theme = theme

    try {
      const result = await bridge.setHostTheme(theme)
      if (!result?.applied) {
        setStatus(`微信读书已切换为${theme === 'dark' ? '深色' : '浅色'}，ZTools 主题同步不可用`)
        return
      }

      setStatus(
        result.persisted
          ? `微信读书与 ZTools 已同步为${theme === 'dark' ? '深色' : '浅色'}模式`
          : `ZTools 已切换为${theme === 'dark' ? '深色' : '浅色'}，但未能保存该设置`,
      )
    } catch (error) {
      setStatus(`微信读书已切换为${theme === 'dark' ? '深色' : '浅色'}，ZTools 主题同步失败`)
    }
  }

  function wait(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds))
  }

  async function readReaderThemeFromControls() {
    try {
      const theme = await webview.executeJavaScript(
        `(() => {
          const switchToLight = document.querySelector('.readerControls_item.white')
          const switchToDark = document.querySelector('.readerControls_item.dark')
          if (switchToLight && !switchToDark) return 'dark'
          if (switchToDark && !switchToLight) return 'light'
          return null
        })()`,
        true,
      )
      return theme === 'dark' || theme === 'light' ? theme : null
    } catch (error) {
      return null
    }
  }

  async function waitForReaderTheme(expectedTheme) {
    for (let attempt = 0; attempt < 20; attempt += 1) {
      await wait(attempt === 0 ? 80 : 120)
      if ((await readReaderThemeFromControls()) === expectedTheme) return true
    }
    return false
  }

  function setRemoteMenuOpen(isOpen) {
    try {
      const result = webview.executeJavaScript(
        `document.body.classList.toggle('ztools-reader-menu-open', ${Boolean(isOpen)})`,
        true,
      )
      if (result && typeof result.catch === 'function') result.catch(function ignore() {})
    } catch (error) {}
  }

  function setMenuOpen(isOpen) {
    const shouldOpen = Boolean(isOpen && document.body.classList.contains('is-reader-mode'))
    document.body.classList.toggle('menu-open', shouldOpen)
    menuButton.setAttribute('aria-expanded', String(shouldOpen))
    menuButton.title = shouldOpen ? '收起阅读菜单' : '打开阅读菜单'
    setRemoteMenuOpen(shouldOpen)
  }

  function installReaderMenuHook() {
    try {
      const result = webview.executeJavaScript(
        `(() => {
          if (window.__ztoolsReaderMenuHookInstalled) return true
          window.__ztoolsReaderMenuHookInstalled = true
          document.addEventListener('click', (event) => {
            const item = event.target.closest('.readerControls_item')
            if (!item) return

            const requestedTheme = item.classList.contains('dark')
              ? 'dark'
              : item.classList.contains('white')
                ? 'light'
                : ''
            if (requestedTheme) console.log('__ZTOOLS_READER_THEME__:' + requestedTheme)
            window.setTimeout(() => console.log('__ZTOOLS_READER_MENU_SELECT__'), 600)
          }, false)
          return true
        })()`,
        true,
      )
      if (result && typeof result.catch === 'function') result.catch(function ignore() {})
    } catch (error) {}
  }

  function setLoading(isLoading) {
    loadingOverlay.hidden = !isLoading
  }

  function hideError() {
    errorOverlay.hidden = true
  }

  function showError(message) {
    setLoading(false)
    errorMessage.textContent = message
    errorOverlay.hidden = false
  }

  function normalizedAllowedUrl(rawUrl) {
    return bridge.normalizeWereadUrl(rawUrl)
  }

  function isReaderPage(rawUrl) {
    const allowed = normalizedAllowedUrl(rawUrl)
    if (!allowed) return false

    try {
      return /^\/web\/reader(?:\/|$)/.test(new URL(allowed).pathname)
    } catch (error) {
      return false
    }
  }

  function dispatchReaderResize() {
    try {
      const resizeResult = webview.executeJavaScript(
        `(() => {
          window.dispatchEvent(new Event('resize'))
          window.setTimeout(() => window.dispatchEvent(new Event('resize')), 160)
          window.setTimeout(() => window.dispatchEvent(new Event('resize')), 360)
        })()`,
        true,
      )
      if (resizeResult && typeof resizeResult.catch === 'function') resizeResult.catch(function ignore() {})
    } catch (error) {}
  }

  function syncLocalChrome(rawUrl) {
    const readerPage = isReaderPage(rawUrl)
    const cleanModeActive = readerPage && cleanReaderEnabled

    document.body.classList.toggle('is-reader-mode', cleanModeActive)
    if (!cleanModeActive) setMenuOpen(false)
    cleanModeButton.hidden = !readerPage
    cleanModeButton.setAttribute('aria-pressed', String(cleanModeActive))
    cleanModeButton.textContent = cleanModeActive ? '原版界面' : '纯净阅读'
    cleanModeButton.title = cleanModeActive ? '恢复微信读书原版界面' : '启用纯净阅读'
  }

  async function removeReaderStyle() {
    if (!activeReaderStyleKey) return

    const key = activeReaderStyleKey
    activeReaderStyleKey = null
    try {
      await webview.removeInsertedCSS(key)
    } catch (error) {}
  }

  async function detectReaderTheme() {
    const fallbackTheme = hostUsesDarkColors ? 'dark' : 'light'

    try {
      const detectedTheme = await webview.executeJavaScript(
        `(() => {
          if (document.querySelector('.wr_darkTheme')) return 'dark'
          if (document.querySelector('.wr_whiteTheme')) return 'light'

          // 微信读书只渲染“可切换到”的主题按钮：当前深色时出现 white，
          // 当前浅色时出现 dark。透明阅读背景下，这比按文字亮度反推更可靠。
          const switchToLight = document.querySelector('.readerControls_item.white')
          const switchToDark = document.querySelector('.readerControls_item.dark')
          if (switchToLight && !switchToDark) return 'dark'
          if (switchToDark && !switchToLight) return 'light'

          const themeNodes = [
            document.documentElement,
            document.body,
            document.getElementById('app'),
            document.getElementById('routerView'),
            document.querySelector('.readerContent'),
            document.querySelector('.wr_horizontalReader')
          ].filter(Boolean)
          const classText = themeNodes.map((node) => String(node.className || '')).join(' ')
          if (/\\bwr_darkTheme\\b/.test(classText)) return 'dark'
          if (/\\bwr_whiteTheme\\b/.test(classText)) return 'light'

          const parseColor = (value) => {
            const parts = String(value).match(/[\\d.]+/g)
            if (!parts || parts.length < 3) return null
            return {
              red: Number(parts[0]),
              green: Number(parts[1]),
              blue: Number(parts[2]),
              alpha: parts.length > 3 ? Number(parts[3]) : 1
            }
          }
          const luminance = (color) =>
            (color.red * 0.2126 + color.green * 0.7152 + color.blue * 0.0722) / 255

          const surfaceNodes = [
            document.querySelector('.wr_horizontalReader .readerChapterContent'),
            document.querySelector('.readerContent .app_content'),
            document.querySelector('.readerChapterContent'),
            document.querySelector('.readerContent'),
            document.body,
            document.documentElement
          ].filter(Boolean)
          for (const node of surfaceNodes) {
            const color = parseColor(getComputedStyle(node).backgroundColor)
            if (color && color.alpha >= 0.35) return luminance(color) < 0.45 ? 'dark' : 'light'
          }

          // 透明背景会让原站的半透明文字亮度失去判断意义；此时跟随已同步的
          // ZTools 主题，避免浅色被误判成深色或反过来。
          return null
        })()`,
        true,
      )

      return detectedTheme === 'dark' || detectedTheme === 'light' ? detectedTheme : fallbackTheme
    } catch (error) {
      return fallbackTheme
    }
  }

  async function applyReaderPresentation(rawUrl, requestedTheme = null) {
    const readerPage = isReaderPage(rawUrl)
    syncLocalChrome(rawUrl)

    if (!readerPage || !cleanReaderEnabled) {
      await removeReaderStyle()
      readerStyleNeedsRefresh = false
      dispatchReaderResize()
      return
    }

    if ((activeReaderStyleKey && !readerStyleNeedsRefresh) || readerStyleApplying) return

    readerStyleApplying = true
    try {
      await removeReaderStyle()
      const readerTheme =
        requestedTheme === 'dark' || requestedTheme === 'light'
          ? requestedTheme
          : await detectReaderTheme()
      activeReaderStyleKey = await webview.insertCSS(buildCleanReaderCss(readerTheme === 'dark'))
      document.documentElement.dataset.readerTheme = readerTheme
      readerStyleNeedsRefresh = false
      dispatchReaderResize()
      installReaderMenuHook()
    } catch (error) {
      activeReaderStyleKey = null
      setStatus('纯净阅读样式加载失败，可点击“简”重试')
    } finally {
      readerStyleApplying = false
    }
  }

  async function handleReaderThemeRequest(expectedTheme) {
    if (expectedTheme !== 'dark' && expectedTheme !== 'light') return

    const requestId = ++readerThemeRequestId
    readerThemeRequestInFlight = true
    setStatus(`正在切换为${expectedTheme === 'dark' ? '深色' : '浅色'}模式…`)

    try {
      const confirmed = await waitForReaderTheme(expectedTheme)
      if (requestId !== readerThemeRequestId) return

      const actualTheme = confirmed
        ? expectedTheme
        : (await readReaderThemeFromControls()) || (await detectReaderTheme())

      readerStyleNeedsRefresh = true
      await applyReaderPresentation(getCurrentUrl(), actualTheme)
      if (requestId !== readerThemeRequestId) return

      await syncHostTheme(actualTheme)

      if (!confirmed) {
        setStatus(
          `微信读书未完成主题切换，已恢复为${actualTheme === 'dark' ? '深色' : '浅色'}模式`,
        )
      }
    } finally {
      if (requestId === readerThemeRequestId) readerThemeRequestInFlight = false
    }
  }

  function scheduleHostThemeReconcile() {
    if (hostThemeReconcileTimer) window.clearTimeout(hostThemeReconcileTimer)
    hostThemeReconcileTimer = window.setTimeout(async () => {
      hostThemeReconcileTimer = null
      if (readerThemeRequestInFlight || !isReaderPage(getCurrentUrl())) return

      const readerTheme = (await readReaderThemeFromControls()) || (await detectReaderTheme())
      readerStyleNeedsRefresh = true
      await applyReaderPresentation(getCurrentUrl(), readerTheme)

      const hostTheme = hostUsesDarkColors ? 'dark' : 'light'
      if (hostTheme !== readerTheme) await syncHostTheme(readerTheme)
    }, 900)
  }

  function getCurrentUrl() {
    try {
      return normalizedAllowedUrl(webview.getURL()) || normalizedAllowedUrl(lastKnownUrl) || HOME_URL
    } catch (error) {
      return normalizedAllowedUrl(lastKnownUrl) || HOME_URL
    }
  }

  function updateBackButton() {
    try {
      backButton.disabled = !webview.canGoBack()
    } catch (error) {
      backButton.disabled = true
    }
  }

  function navigate(rawUrl, options = {}) {
    const target = normalizedAllowedUrl(rawUrl) || HOME_URL
    const current = getCurrentUrl()

    hideError()
    setLoading(true)
    setStatus(target === HOME_URL ? '正在打开微信读书书架…' : '正在恢复上次阅读…')
    lastRequestedUrl = target
    syncLocalChrome(target)

    if (options.force && current === target) {
      try {
        webview.reload()
        return
      } catch (error) {
        // webview 尚未就绪时继续设置 src。
      }
    }

    webview.setAttribute('src', target)
    initialNavigationDone = true
  }

  function saveIfReaderUrl(rawUrl) {
    if (bridge.saveReaderUrl(rawUrl)) {
      setStatus('已记住当前阅读位置')
    }
  }

  function handleNavigation(rawUrl) {
    const allowed = normalizedAllowedUrl(rawUrl)
    if (!allowed) return

    lastKnownUrl = allowed
    syncLocalChrome(allowed)
    saveIfReaderUrl(allowed)
    updateBackButton()
    setMenuOpen(false)
  }

  function applyLaunchIntent(code, isInitial = false) {
    const saved = bridge.getSavedReaderUrl()

    if (code === 'weread_shelf') {
      didAutoFallback = false
      navigate(HOME_URL, { force: !isInitial })
      return
    }

    if (code === 'weread_continue') {
      didAutoFallback = false
      navigate(saved || HOME_URL, { force: !isInitial })
      return
    }

    if (isInitial || !initialNavigationDone || !normalizedAllowedUrl(getCurrentUrl())) {
      navigate(saved || HOME_URL)
    }
  }

  function openCurrentInBrowser() {
    if (!bridge.openInSystemBrowser(getCurrentUrl())) {
      showError('当前页面不是允许打开的微信读书地址。')
    }
  }

  menuButton.addEventListener('click', function toggleReaderMenu(event) {
    event.stopPropagation()
    const willOpen = !document.body.classList.contains('menu-open')
    setMenuOpen(willOpen)
  })

  menuPanel.addEventListener('click', function keepMenuClickLocal(event) {
    event.stopPropagation()
  })

  document.addEventListener('pointerdown', function closeMenuFromOutside(event) {
    if (!document.body.classList.contains('menu-open')) return
    if (!event.target.closest('.toolbar')) setMenuOpen(false)
  })

  document.addEventListener('keydown', function closeMenuWithEscape(event) {
    if (event.key !== 'Escape') return
    if (document.body.classList.contains('menu-open')) {
      setMenuOpen(false)
      return
    }
  })

  backButton.addEventListener('click', function goBack() {
    setMenuOpen(false)
    try {
      if (webview.canGoBack()) webview.goBack()
    } catch (error) {
      setStatus('当前没有可返回的页面')
    }
  })

  document.getElementById('continueButton').addEventListener('click', function continueReading() {
    setMenuOpen(false)
    didAutoFallback = false
    navigate(bridge.getSavedReaderUrl() || HOME_URL, { force: true })
  })

  document.getElementById('shelfButton').addEventListener('click', function openShelf() {
    setMenuOpen(false)
    didAutoFallback = false
    navigate(HOME_URL, { force: true })
  })

  document.getElementById('catalogButton').addEventListener('click', async function openCatalog() {
    setMenuOpen(false)

    if (!isReaderPage(getCurrentUrl())) {
      setStatus('请先从书架打开一本书，再查看目录')
      return
    }

    try {
      const opened = await webview.executeJavaScript(
        `(() => {
          const controls = Array.from(document.querySelectorAll('.readerControls_item'))
          const catalogButton = controls.find((item) => {
            const label = [
              item.className,
              item.getAttribute('title'),
              item.getAttribute('aria-label'),
              item.closest('.wr_tooltip_container')?.textContent
            ].filter(Boolean).join(' ')
            return item.classList.contains('catalog') || /目录|章节/.test(label)
          })
          if (!catalogButton) return false
          catalogButton.click()
          return true
        })()`,
        true,
      )
      setStatus(opened ? '已打开目录' : '当前页面未找到目录，请刷新后重试')
    } catch (error) {
      setStatus('目录打开失败，请刷新后重试')
    }
  })

  document.getElementById('reloadButton').addEventListener('click', function reloadPage() {
    setMenuOpen(false)
    hideError()
    setLoading(true)
    try {
      webview.reload()
    } catch (error) {
      navigate(getCurrentUrl(), { force: true })
    }
  })

  cleanModeButton.addEventListener('click', function toggleCleanReader() {
    setMenuOpen(false)
    cleanReaderEnabled = !cleanReaderEnabled
    applyReaderPresentation(getCurrentUrl())
  })

  document.getElementById('externalButton').addEventListener('click', function openExternalFromMenu() {
    setMenuOpen(false)
    openCurrentInBrowser()
  })
  document.getElementById('errorExternalButton').addEventListener('click', openCurrentInBrowser)
  document.getElementById('retryButton').addEventListener('click', function retry() {
    didAutoFallback = false
    navigate(lastRequestedUrl, { force: true })
  })
  document.getElementById('errorShelfButton').addEventListener('click', function recoverToShelf() {
    didAutoFallback = false
    navigate(HOME_URL, { force: true })
  })

  webview.addEventListener('console-message', function handleReaderCommand(event) {
    const themeMatch = /^__ZTOOLS_READER_THEME__:(dark|light)$/.exec(event.message)
    if (themeMatch) {
      void handleReaderThemeRequest(themeMatch[1])
      return
    }

    if (event.message !== '__ZTOOLS_READER_MENU_SELECT__') return
    setMenuOpen(false)
    if (readerThemeRequestInFlight) return
    readerStyleNeedsRefresh = true
    applyReaderPresentation(getCurrentUrl())
  })

  webview.addEventListener('did-start-loading', function onStartLoading() {
    readerStyleNeedsRefresh = true
    hideError()
    setLoading(true)
    setStatus('微信读书正在加载…')
  })

  webview.addEventListener('did-stop-loading', function onStopLoading() {
    setLoading(false)
    const currentUrl = getCurrentUrl()
    handleNavigation(currentUrl)
    applyReaderPresentation(currentUrl)
    scheduleHostThemeReconcile()
    if (currentUrl === HOME_URL) didAutoFallback = false
    setStatus('微信读书已打开')
  })

  webview.addEventListener('dom-ready', function onDomReady() {
    setLoading(false)
    const currentUrl = getCurrentUrl()
    handleNavigation(currentUrl)
    applyReaderPresentation(currentUrl)
    scheduleHostThemeReconcile()
    updateBackButton()
    setStatus('微信读书已打开')
  })

  webview.addEventListener('did-navigate', function onNavigate(event) {
    handleNavigation(event.url)
  })

  webview.addEventListener('did-navigate-in-page', function onNavigateInPage(event) {
    handleNavigation(event.url)
  })

  webview.addEventListener('will-navigate', function guardNavigation(event) {
    if (normalizedAllowedUrl(event.url)) return
    try {
      event.preventDefault()
    } catch (error) {}
    setStatus('已阻止离开微信读书的页面')
  })

  webview.addEventListener('new-window', function guardPopup(event) {
    try {
      event.preventDefault()
    } catch (error) {}

    setStatus('已阻止网页弹出新窗口')
  })

  webview.addEventListener('did-fail-load', function onLoadFailure(event) {
    if (event.errorCode === LOAD_ABORTED) return

    const failedUrl = normalizedAllowedUrl(event.validatedURL || lastRequestedUrl)
    const wasReaderPage = Boolean(failedUrl && failedUrl !== HOME_URL)

    if (wasReaderPage && !didAutoFallback) {
      didAutoFallback = true
      setStatus('续读页面失效，正在返回微信读书首页…')
      window.setTimeout(function fallbackToHome() {
        navigate(HOME_URL)
      }, 350)
      return
    }

    const reason = event.errorDescription ? `（${event.errorDescription}）` : ''
    showError(`微信读书页面加载失败${reason}，请检查网络后重试。`)
    setStatus('页面加载失败')
  })

  window.addEventListener('weread:plugin-enter', function onPluginReenter(event) {
    applyLaunchIntent(event.detail?.code || 'weread')
  })

  if (bridge.launchesStandalone) {
    setLoading(false)
    setStatus('正在打开独立亚克力阅读窗口…')
  } else {
    applyLaunchIntent(bridge.getLaunchState().code, true)
  }
})()
