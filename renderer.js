;(function initWereadRenderer() {
  'use strict'

  const bridge = window.wereadBridge
  const HOME_URL = bridge.homeUrl
  const LOAD_ABORTED = -3
  document.documentElement.classList.toggle('is-standalone-window', Boolean(bridge.isStandalone))
  const CLEAN_READER_CSS = `
    html:has(body.wr_page_reader) {
      background-color: transparent !important;
      background-image: none !important;
      color-scheme: dark !important;
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

    body.wr_page_reader .readerChapterContent,
    body.wr_page_reader .readerChapterContent * {
      color: #edf0ee !important;
    }

    body.wr_page_reader .readerChapterContent h1,
    body.wr_page_reader .readerChapterContent h2,
    body.wr_page_reader .readerChapterContent h3 {
      color: #f7f8f7 !important;
    }

    body.wr_page_reader .readerContentHeader,
    body.wr_page_reader .readerFooter {
      color: #b9bfbb !important;
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
    }

    body.wr_page_reader.ztools-reader-menu-open .readerControls_item::after {
      color: #f3f3f3 !important;
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

  function setStatus(message) {
    statusText.textContent = message
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
            if (event.target.closest('.readerControls_item')) {
              window.setTimeout(() => console.log('__ZTOOLS_READER_MENU_SELECT__'), 600)
            }
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

  async function applyReaderPresentation(rawUrl) {
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
      activeReaderStyleKey = await webview.insertCSS(CLEAN_READER_CSS)
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

  webview.addEventListener('console-message', function closeMenuAfterReaderCommand(event) {
    if (event.message === '__ZTOOLS_READER_MENU_SELECT__') setMenuOpen(false)
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
    if (currentUrl === HOME_URL) didAutoFallback = false
    setStatus('微信读书已打开')
  })

  webview.addEventListener('dom-ready', function onDomReady() {
    setLoading(false)
    const currentUrl = getCurrentUrl()
    handleNavigation(currentUrl)
    applyReaderPresentation(currentUrl)
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
