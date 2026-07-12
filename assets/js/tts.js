(function() {
  'use strict';

  /* Edge Neural TTS (primary) + Web Speech API (fallback) */

  var EDGE_WS_URL = 'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4';
  var EDGE_VOICES = {
    'zh-CN': { name: 'zh-CN-XiaoxiaoNeural', style: 'friendly' },
    'zh':    { name: 'zh-CN-XiaoxiaoNeural', style: 'friendly' },
    'en':    { name: 'en-US-AriaNeural',     style: 'narration' },
    'en-US': { name: 'en-US-AriaNeural',     style: 'narration' }
  };

  function init() {
    var ttsBar = document.querySelector('.tts-bar');
    if (!ttsBar) return;
    if (!('speechSynthesis' in window)) { ttsBar.style.display = 'none'; return; }

    var playBtn = ttsBar.querySelector('.tts-play');
    var stopBtn = ttsBar.querySelector('.tts-stop');
    var speedSelect = ttsBar.querySelector('.tts-speed');
    var playIcon = playBtn.querySelector('.tts-btn-icon');
    var playText = playBtn.querySelector('.tts-btn-text');
    var labelPlay = playBtn.getAttribute('data-label-play') || 'Play';
    var labelPause = playBtn.getAttribute('data-label-pause') || 'Pause';

    var state = 'idle';
    var backend = null;
    var useEdge = true;
    var chunks = [];
    var currentIndex = 0;
    var cancelled = false;
    var audioElement = null;
    var currentObjectUrl = null;
    var currentWs = null;
    var keepAliveTimer = null;
    var systemVoice = null;
    var lang = document.documentElement.lang || 'zh-CN';
    var langPrefix = lang.split('-')[0];
    var connectionId = generateRequestId();

    function generateRequestId() {
      return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    }
    function escapeXml(t) { return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

    function extractTexts() {
      var content = document.querySelector('.Content');
      if (!content) return [];
      var clone = content.cloneNode(true);
      clone.querySelectorAll('pre, .mermaid, [data-mermaid], table, script, style, .tts-bar, .code-block-wrapper').forEach(function(el) { el.remove(); });
      var blocks = clone.querySelectorAll('p, h2, h3, h4, li, blockquote');
      var texts = [];
      blocks.forEach(function(b) { var t = b.textContent.trim(); if (t) texts.push(t); });
      return texts;
    }

    function chunkForEdge(texts) {
      var result = []; var current = '';
      texts.forEach(function(t) {
        if ((current + ' ' + t).length > 500) {
          if (current) result.push(current);
          current = t.length > 800 ? splitLong(t, 800).join(' ') : t;
        } else { current = current ? current + ' ' + t : t; }
      });
      if (current) result.push(current);
      return result.length ? result : texts;
    }

    function chunkForSystem(texts) {
      var result = [];
      texts.forEach(function(text) {
        if (text.length > 200) { splitLong(text, 200).forEach(function(s) { if (s.trim()) result.push(s.trim()); }); }
        else { result.push(text); }
      });
      return result.length ? result : texts;
    }

    function splitLong(text, maxLen) {
      if (text.length <= maxLen) return [text];
      var result = []; var parts = text.split(/([。.!！?？；;\n]+)/); var current = '';
      for (var i = 0; i < parts.length; i++) {
        if ((current + parts[i]).length > maxLen && current.trim()) { result.push(current.trim()); current = parts[i]; }
        else { current += parts[i]; }
      }
      if (current.trim()) result.push(current.trim());
      return result;
    }

    function edgeSynthesize(text) {
      return new Promise(function(resolve, reject) {
        var requestId = generateRequestId(); var ws;
        try { ws = new WebSocket(EDGE_WS_URL + '&Connection-Id=' + connectionId); } catch(e) { reject(e); return; }
        currentWs = ws; var audioParts = []; var settled = false;
        ws.binaryType = 'arraybuffer';
        var timer = setTimeout(function() {
          if (!settled) { settled = true; try { ws.close(); } catch(e) {} currentWs = null; reject(new Error('timeout')); }
        }, 15000);

        ws.onopen = function() {
          var config = JSON.stringify({ context: { synthesis: { audio: {
            metadataoptions: { sentenceBoundaryEnabled: 'false', wordBoundaryEnabled: 'false' },
            outputFormat: 'audio-24khz-96kbitrate-mono-mp3'
          } } } });
          ws.send('X-RequestId:' + requestId + '\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n' + config);
          var vc = EDGE_VOICES[lang] || EDGE_VOICES[langPrefix] || EDGE_VOICES['zh-CN'];
          var ssml = "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts' xml:lang='" + lang + "'><voice name='" + vc.name + "'><mstts:express-as style='" + vc.style + "'><prosody rate='+0%'>" + escapeXml(text) + "</prosody></mstts:express-as></voice></speak>";
          ws.send('X-RequestId:' + requestId + '\r\nContent-Type:application/ssml+xml\r\nPath:ssml\r\n\r\n' + ssml);
        };

        ws.onmessage = function(event) {
          if (typeof event.data === 'string') {
            if (event.data.indexOf('Path:turn.end') !== -1) {
              if (!settled) { settled = true; clearTimeout(timer); try { ws.close(); } catch(e) {} currentWs = null;
                if (audioParts.length > 0) resolve(new Blob(audioParts, { type: 'audio/mpeg' })); else reject(new Error('no audio')); }
            }
          } else {
            if (event.data.byteLength < 3) return;
            var dv = new DataView(event.data); var headerLen = dv.getUint16(0);
            if (event.data.byteLength > 2 + headerLen) audioParts.push(event.data.slice(2 + headerLen));
          }
        };
        ws.onerror = function() { if (!settled) { settled = true; clearTimeout(timer); currentWs = null; reject(new Error('ws error')); } };
        ws.onclose = function() { if (!settled) { settled = true; clearTimeout(timer); currentWs = null;
          if (audioParts.length > 0) resolve(new Blob(audioParts, { type: 'audio/mpeg' })); else reject(new Error('closed')); } };
      });
    }

    function ensureAudio() {
      if (audioElement) return;
      audioElement = document.createElement('audio');
      audioElement.preservesPitch = true;
      audioElement.addEventListener('ended', function() {
        if (!cancelled && backend === 'edge' && state === 'playing') edgePlayChunk(currentIndex + 1);
      });
    }

    function edgePlayChunk(index) {
      if (cancelled) return;
      if (index >= chunks.length) { finishPlayback(); return; }
      currentIndex = index; state = 'loading'; updateUI();
      edgeSynthesize(chunks[index]).then(function(blob) {
        if (cancelled || state === 'idle') return;
        ensureAudio();
        if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
        currentObjectUrl = URL.createObjectURL(blob);
        audioElement.src = currentObjectUrl;
        audioElement.playbackRate = parseFloat(speedSelect.value) || 1;
        if (state === 'paused') return;
        return audioElement.play();
      }).then(function() {
        if (cancelled || state === 'idle' || state === 'paused') return;
        state = 'playing'; updateUI();
      }).catch(function() {
        if (cancelled || state === 'idle') return;
        switchToSystem();
      });
    }

    function getSystemVoice() {
      if (systemVoice) return systemVoice;
      var voices = speechSynthesis.getVoices();
      systemVoice = voices.find(function(v) { return v.lang === lang; })
        || voices.find(function(v) { return v.lang.indexOf(langPrefix) === 0; })
        || voices[0] || null;
      return systemVoice;
    }

    function systemSpeakChunk(index) {
      if (cancelled || backend !== 'system') return;
      if (index >= chunks.length) { finishPlayback(); return; }
      currentIndex = index;
      var u = new SpeechSynthesisUtterance(chunks[index]);
      u.lang = lang; u.rate = parseFloat(speedSelect.value) || 1;
      var v = getSystemVoice(); if (v) u.voice = v;
      u.onend = function() { if (!cancelled && backend === 'system') systemSpeakChunk(currentIndex + 1); };
      u.onerror = function() { if (!cancelled && backend === 'system') systemSpeakChunk(currentIndex + 1); };
      state = 'playing'; updateUI(); speechSynthesis.speak(u);
    }

    function startKeepAlive() {
      if (keepAliveTimer) return;
      keepAliveTimer = setInterval(function() {
        if (state === 'playing' && backend === 'system' && !speechSynthesis.paused) { speechSynthesis.pause(); speechSynthesis.resume(); }
      }, 10000);
    }
    function stopKeepAlive() { if (keepAliveTimer) { clearInterval(keepAliveTimer); keepAliveTimer = null; } }

    function switchToSystem() {
      useEdge = false; backend = 'system';
      chunks = chunkForSystem(extractTexts()); currentIndex = 0;
      if (currentWs) { try { currentWs.close(); } catch(e) {} currentWs = null; }
      if (audioElement) { audioElement.pause(); audioElement.removeAttribute('src'); }
      if (currentObjectUrl) { URL.revokeObjectURL(currentObjectUrl); currentObjectUrl = null; }
      speechSynthesis.cancel(); startKeepAlive(); systemSpeakChunk(0);
    }

    function startPlayback() {
      cancelled = false;
      var texts = extractTexts(); if (texts.length === 0) return;
      if (useEdge) { backend = 'edge'; chunks = chunkForEdge(texts); currentIndex = 0; edgePlayChunk(0); }
      else { backend = 'system'; chunks = chunkForSystem(texts); currentIndex = 0; speechSynthesis.cancel(); startKeepAlive(); systemSpeakChunk(0); }
    }
    function pausePlayback() {
      if (state !== 'playing' && state !== 'loading') return;
      if (backend === 'edge' && audioElement && state === 'playing') audioElement.pause();
      if (backend === 'system') speechSynthesis.pause();
      state = 'paused'; updateUI();
    }
    function resumePlayback() {
      if (state !== 'paused') return;
      if (backend === 'edge') {
        if (audioElement && audioElement.src) audioElement.play().then(function() { state = 'playing'; updateUI(); }).catch(function() { switchToSystem(); });
        else startPlayback();
      } else { speechSynthesis.resume(); state = 'playing'; updateUI(); }
    }
    function stopPlayback() {
      cancelled = true; state = 'idle'; currentIndex = 0;
      if (currentWs) { try { currentWs.close(); } catch(e) {} currentWs = null; }
      if (audioElement) { audioElement.pause(); audioElement.removeAttribute('src'); }
      if (currentObjectUrl) { URL.revokeObjectURL(currentObjectUrl); currentObjectUrl = null; }
      if ('speechSynthesis' in window) speechSynthesis.cancel();
      stopKeepAlive(); updateUI();
    }
    function finishPlayback() { state = 'idle'; currentIndex = 0; if (currentObjectUrl) { URL.revokeObjectURL(currentObjectUrl); currentObjectUrl = null; } stopKeepAlive(); updateUI(); }

    function onSpeedChange() {
      if (backend === 'edge' && audioElement) audioElement.playbackRate = parseFloat(speedSelect.value) || 1;
      else if (backend === 'system' && (state === 'playing' || state === 'paused')) { speechSynthesis.cancel(); systemSpeakChunk(currentIndex); }
    }

    function updateUI() {
      var icon, text;
      switch (state) {
        case 'loading': icon='\u23F3'; text='...'; playBtn.classList.add('loading'); stopBtn.disabled=false; break;
        case 'playing': icon='\u23F8'; text=labelPause; playBtn.classList.remove('loading'); stopBtn.disabled=false; break;
        case 'paused': icon='\u25B6'; text=labelPlay; playBtn.classList.remove('loading'); stopBtn.disabled=false; break;
        default: icon='\u25B6'; text=labelPlay; playBtn.classList.remove('loading'); stopBtn.disabled=true; break;
      }
      playIcon.textContent = icon; playText.textContent = text;
    }

    playBtn.addEventListener('click', function() {
      switch (state) {
        case 'idle': startPlayback(); break;
        case 'loading': case 'playing': pausePlayback(); break;
        case 'paused': resumePlayback(); break;
      }
    });
    stopBtn.addEventListener('click', stopPlayback);
    speedSelect.addEventListener('change', onSpeedChange);

    window.addEventListener('beforeunload', function() {
      cancelled = true;
      if (currentWs) { try { currentWs.close(); } catch(e) {} }
      if (audioElement) audioElement.pause();
      if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
      if ('speechSynthesis' in window) speechSynthesis.cancel();
      stopKeepAlive();
    });

    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.addEventListener('voiceschanged', function() { systemVoice = null; }, { once: true });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
