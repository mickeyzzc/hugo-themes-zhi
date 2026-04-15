(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.copy-button').forEach(function(button) {
      button.addEventListener('click', function() {
        const code = this.getAttribute('data-code');
        if (!code) {
          const codeBlock = this.closest('.code-block-wrapper').querySelector('code');
          if (codeBlock) {
            const textToCopy = codeBlock.textContent || codeBlock.innerText;
            copyToClipboard(textToCopy, this);
          }
        } else {
          copyToClipboard(code, this);
        }
      });
    });

    function copyToClipboard(text, button) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
          showCopiedFeedback(button);
        }).catch(function() {
          fallbackCopy(text, button);
        });
      } else {
        fallbackCopy(text, button);
      }
    }

    function fallbackCopy(text, button) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();

      try {
        document.execCommand('copy');
        showCopiedFeedback(button);
      } catch (err) {
        console.error('Copy failed:', err);
      }

      document.body.removeChild(textarea);
    }

    function showCopiedFeedback(button) {
      button.classList.add('copied');

      setTimeout(function() {
        button.classList.remove('copied');
      }, 2000);
    }
  });

})();
