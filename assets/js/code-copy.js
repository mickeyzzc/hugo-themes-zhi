(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.copy-button').forEach(function(button) {
      // Create tooltip element
      var tooltip = document.createElement('span');
      tooltip.className = 'copy-tooltip';
      tooltip.textContent = 'Copy';
      button.appendChild(tooltip);

      button.addEventListener('click', function() {
        const code = this.getAttribute('data-code');
        if (!code) {
          var wrapper = this.closest('.code-block-wrapper');
          var codeBlock = wrapper.querySelector('.lntd:last-child pre code')
            || wrapper.querySelector('.code-block-body pre code')
            || wrapper.querySelector('code');
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
      var tooltip = button.querySelector('.copy-tooltip');
      if (tooltip) tooltip.textContent = 'Copied!';

      setTimeout(function() {
        button.classList.remove('copied');
        if (tooltip) tooltip.textContent = 'Copy';
      }, 2000);
    }
  });

})();
