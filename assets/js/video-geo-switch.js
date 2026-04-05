/**
 * Video Geo Switch - Handles Bilibili/YouTube video switching based on timezone
 * and user preference stored in localStorage
 */
class VideoGeoSwitch {
  constructor() {
    this.init();
  }

  /**
   * Initialize all video containers on the page
   */
  init() {
    const videoContainers = document.querySelectorAll('.video-container');
    videoContainers.forEach(container => {
      this.setupVideoContainer(container);
    });
  }

  /**
   * Setup a single video container
   * @param {HTMLElement} container - The video container element
   */
  setupVideoContainer(container) {
    const bilibiliId = container.getAttribute('data-bilibili');
    const youtubeId = container.getAttribute('data-youtube');
    const title = container.getAttribute('data-title');
    
    // Skip if no video IDs provided
    if (!bilibiliId && !youtubeId) {
      return;
    }
    
    // Determine which platform to show initially
    const initialPlatform = this.getInitialPlatform(bilibiliId, youtubeId);
    
    // Render the video
    this.renderVideo(container, initialPlatform, bilibiliId, youtubeId, title);
    
    // Add switch button if both platforms are available and switch is enabled
    if (bilibiliId && youtubeId && this.shouldShowSwitch()) {
      this.addSwitchButton(container, bilibiliId, youtubeId, title);
    }
  }

  /**
   * Get the initial platform based on priority: localStorage > timezone > config default
   * @param {string} bilibiliId - Bilibili BV ID
   * @param {string} youtubeId - YouTube video ID
   * @returns {string} - Either 'bilibili' or 'youtube'
   */
  getInitialPlatform(bilibiliId, youtubeId) {
    // 1. Check localStorage first
    const storedPreference = localStorage.getItem('videoPlatformPreference');
    if (storedPreference === 'bilibili' || storedPreference === 'youtube') {
      return storedPreference;
    }
    
    // 2. Check timezone for CN
    if (this.isChinaTimezone()) {
      return 'bilibili';
    }
    
    // 3. Fallback to config default
    const configDefault = this.getConfigDefault();
    return configDefault === 'youtube' && youtubeId ? 'youtube' : 'bilibili';
  }

  /**
   * Check if the current timezone is in China
   * @returns {boolean} - True if in China timezone
   */
  isChinaTimezone() {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return timeZone === 'Asia/Shanghai' || 
             timeZone === 'Asia/Chongqing' || 
             timeZone === 'Asia/Urumqi' ||
             timeZone === 'Asia/Harbin';
    } catch (e) {
      // Fallback if Intl is not supported
      return false;
    }
  }

  /**
   * Get the default platform from Hugo config
   * @returns {string} - Default platform ('bilibili' or 'youtube')
   */
  getConfigDefault() {
    // Try to get from a data attribute on html or body, or default to bilibili
    const htmlElement = document.documentElement;
    if (htmlElement.hasAttribute('data-video-default')) {
      return htmlElement.getAttribute('data-video-default');
    }
    
    // Default from hugo.toml params.video.defaultPlatform
    return 'bilibili';
  }

  /**
   * Check if switch button should be shown
   * @returns {boolean} - True if switch should be shown
   */
  shouldShowSwitch() {
    // Try to get from config, default to true
    const htmlElement = document.documentElement;
    if (htmlElement.hasAttribute('data-video-show-switch')) {
      return htmlElement.getAttribute('data-video-show-switch') !== 'false';
    }
    
    // Default from hugo.toml params.video.showSwitch
    return true;
  }

  /**
   * Render the video iframe for the specified platform
   * @param {HTMLElement} container - The video container element
   * @param {string} platform - Either 'bilibili' or 'youtube'
   * @param {string} bilibiliId - Bilibili BV ID
   * @param {string} youtubeId - YouTube video ID
   * @param {string} title - Video title (optional)
   */
  renderVideo(container, platform, bilibiliId, youtubeId, title) {
    // Clear container
    container.innerHTML = '';
    
    // Add title if provided
    if (title) {
      const titleElement = document.createElement('div');
      titleElement.className = 'video-title';
      titleElement.textContent = title;
      container.appendChild(titleElement);
    }
    
    // Create iframe based on platform
    let iframeUrl = '';
    if (platform === 'bilibili' && bilibiliId) {
      iframeUrl = `https://player.bilibili.com/player.html?bvid=${bilibiliId}&autoplay=0`;
    } else if (platform === 'youtube' && youtubeId) {
      iframeUrl = `https://www.youtube.com/embed/${youtubeId}?rel=0`;
    }
    
    if (iframeUrl) {
      const iframe = document.createElement('iframe');
      iframe.src = iframeUrl;
      iframe.frameBorder = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.loading = 'lazy';
      
      container.appendChild(iframe);
    }
  }

  /**
   * Add switch button to toggle between platforms
   * @param {HTMLElement} container - The video container element
   * @param {string} bilibiliId - Bilibili BV ID
   * @param {string} youtubeId - YouTube video ID
   * @param {string} title - Video title (optional)
   */
  addSwitchButton(container, bilibiliId, youtubeId, title) {
    const switchButton = document.createElement('button');
    switchButton.className = 'video-switch-button';
    switchButton.textContent = '切换平台'; // Switch Platform
    switchButton.setAttribute('aria-label', '切换视频平台');
    
    // Add click event listener
    switchButton.addEventListener('click', () => {
      // Determine current platform by checking which iframe is present
      const currentIframe = container.querySelector('iframe');
      let currentPlatform = 'bilibili'; // default
      
      if (currentIframe && currentIframe.src) {
        if (currentIframe.src.includes('youtube.com/embed')) {
          currentPlatform = 'youtube';
        } else if (currentIframe.src.includes('player.bilibili.com')) {
          currentPlatform = 'bilibili';
        }
      }
      
      // Switch to the other platform
      const newPlatform = currentPlatform === 'bilibili' && youtubeId ? 'youtube' : 'bilibili';
      
      // Save preference to localStorage
      localStorage.setItem('videoPlatformPreference', newPlatform);
      
      // Re-render with new platform
      this.renderVideo(container, newPlatform, bilibiliId, youtubeId, title);
      
      // Update button text
      switchButton.textContent = newPlatform === 'bilibili' ? '切换到 YouTube' : '切换到 Bilibili';
    });
    
    container.appendChild(switchButton);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new VideoGeoSwitch();
});