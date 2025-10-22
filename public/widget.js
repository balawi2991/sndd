/**
 * MintChat Widget - Standalone Embed Script
 * This script loads the chat widget on any website
 */

(function() {
  'use strict';

  // Configuration
  const API_BASE = 'https://sndd-production.up.railway.app'; // Your production URL
  let widgetConfig = null;
  let botId = null;
  let sessionId = null;

  // Generate session ID
  function generateSessionId() {
    return 'session_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }

  // Get or create session ID
  function getSessionId() {
    if (sessionId) return sessionId;
    
    // Try to get from localStorage
    const stored = localStorage.getItem('mintchat_session');
    if (stored) {
      sessionId = stored;
      return sessionId;
    }
    
    // Create new
    sessionId = generateSessionId();
    localStorage.setItem('mintchat_session', sessionId);
    return sessionId;
  }

  // Load widget configuration
  async function loadConfig(botIdParam) {
    try {
      const response = await fetch(`${API_BASE}/api/widget/${botIdParam}/config`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors', // Enable CORS
        credentials: 'omit', // Don't send cookies
      });
      if (!response.ok) {
        throw new Error('Failed to load widget configuration');
      }
      const data = await response.json();
      return data.config;
    } catch (error) {
      console.error('MintChat: Failed to load configuration', error);
      return null;
    }
  }

  // Send message to API
  async function sendMessage(message, conversationId) {
    try {
      const response = await fetch(`${API_BASE}/api/widget/${botId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors', // Enable CORS
        credentials: 'omit', // Don't send cookies
        body: JSON.stringify({
          message,
          conversationId,
          sessionId: getSessionId(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }

      return await response.json();
    } catch (error) {
      console.error('MintChat: Failed to send message', error);
      throw error;
    }
  }

  // Inject CSS (inline)
  function injectStyles() {
    if (document.getElementById('mintchat-styles')) return;

    const style = document.createElement('style');
    style.id = 'mintchat-styles';
    style.textContent = `
      /* MintChat Widget Styles */
      .mintchat-widget {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 9999;
      }
      
      .mintchat-widget-container {
        position: relative;
        width: 100%;
        height: 100%;
      }
      
      /* Ask Bar */
      .mintchat-askbar-wrapper {
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        -webkit-transform: translateX(-50%);
        -moz-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
        bottom: 16px;
        z-index: 10002;
        pointer-events: auto;
      }
      
      .mintchat-askbar-form {
        width: 100%;
      }
      
      .mintchat-askbar {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0 1rem;
        background: white;
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 9999px;
        box-shadow: 
          0 0 0 1px rgba(0, 0, 0, 0.02),
          0 4px 6px -1px rgba(0, 0, 0, 0.08),
          0 2px 4px -1px rgba(0, 0, 0, 0.04);
        max-width: 360px;
        height: 56px;
        width: 90vw;
        transition: all 150ms;
      }
      
      .mintchat-askbar--glow::before {
        content: "";
        position: absolute;
        inset: -2px;
        border-radius: inherit;
        background: linear-gradient(90deg, #FFC07A, #F4A6C5, #C9B7FF);
        background-size: 300% 100%;
        animation: glow-move 9s linear infinite reverse;
        -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        padding: 2px;
        z-index: -1;
      }
      
      @keyframes glow-move {
        0% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      .mintchat-askbar__icon {
        flex-shrink: 0;
        color: #6b7280;
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
      }
      
      .mintchat-askbar__input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        resize: none;
        font-size: 0.875rem;
        color: #111827;
        padding: 0;
        height: 24px;
        line-height: 1.5;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow: hidden;
      }
      
      .mintchat-askbar__input::placeholder {
        color: #9ca3af;
      }
      
      .mintchat-askbar__send {
        flex-shrink: 0;
        padding: 0.5rem;
        border-radius: 9999px;
        border: none;
        cursor: pointer;
        transition: all 150ms;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }
      
      .mintchat-askbar__send:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      
      .mintchat-askbar__send:not(:disabled):hover {
        transform: scale(1.05);
      }
      
      /* Modal Backdrop */
      .mintchat-modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.2);
        z-index: 10000;
        pointer-events: auto;
        animation: fade-in 200ms ease-out;
      }
      
      @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      /* Modal */
      .mintchat-modal {
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        bottom: 112px;
        width: 720px;
        max-width: 90vw;
        height: 80vh;
        max-height: 600px;
        background: white;
        border-radius: 0.75rem;
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: 
          0 0 0 1px rgba(0, 0, 0, 0.05),
          0 10px 15px -3px rgba(0, 0, 0, 0.1),
          0 4px 6px -2px rgba(0, 0, 0, 0.05);
        z-index: 10001;
        pointer-events: auto;
        display: flex;
        flex-direction: column;
        animation: modal-slide-up 200ms ease-out;
        /* Cross-browser compatibility */
        -webkit-transform: translateX(-50%);
        -moz-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
        box-sizing: border-box;
      }
      
      @keyframes modal-slide-up {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(16px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }
      
      .mintchat-modal__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 24px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        flex-shrink: 0;
        background: linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(249, 250, 251, 0.4));
      }
      
      .mintchat-modal__header .flex {
        display: flex;
      }
      
      .mintchat-modal__header .items-center {
        align-items: center;
      }
      
      .mintchat-modal__header .gap-3 {
        gap: 12px;
      }
      
      .mintchat-modal__header h2 {
        font-size: 18px;
        font-weight: 600;
        color: #111827;
        margin: 0;
      }
      
      .mintchat-modal__close {
        padding: 8px;
        border-radius: 9999px;
        border: none;
        background: transparent;
        cursor: pointer;
        color: #6b7280;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 150ms;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }
      
      .mintchat-modal__close:hover {
        background: #f3f4f6;
        color: #111827;
      }
      
      .mintchat-modal__content {
        flex: 1;
        overflow-y: auto;
        padding: 24px;
        scroll-behavior: smooth;
        background: linear-gradient(to bottom, rgba(249, 250, 251, 0.3), white);
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
      }
      
      .mintchat-modal__content::-webkit-scrollbar {
        width: 6px;
      }
      
      .mintchat-modal__content::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .mintchat-modal__content::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 9999px;
      }
      
      .mintchat-modal__content::-webkit-scrollbar-thumb:hover {
        background: #9ca3af;
      }
      
      /* Messages */
      .mintchat-messages {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      
      .mintchat-message {
        display: flex;
        gap: 12px;
        align-items: flex-start;
      }
      
      .mintchat-message--user {
        flex-direction: row-reverse;
      }
      
      .mintchat-message__avatar {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        border-radius: 9999px;
        background: #e5e7eb;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
        color: #6b7280;
      }
      
      .mintchat-message__avatar img {
        width: 100%;
        height: 100%;
        border-radius: 9999px;
        object-fit: cover;
      }
      
      .mintchat-message__content {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-width: 80%;
      }
      
      .mintchat-message--user .mintchat-message__content {
        align-items: flex-end;
      }
      
      .mintchat-message__bubble {
        padding: 0.75rem 1rem;
        border-radius: 1rem;
        font-size: 0.875rem;
        line-height: 1.5;
        word-wrap: break-word;
        word-break: break-word;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      .mintchat-message--assistant .mintchat-message__bubble {
        background: #f3f4f6;
        color: #111827;
        border-top-left-radius: 4px;
      }
      
      .mintchat-message--user .mintchat-message__bubble {
        background-color: var(--primary-color, #17B26A);
        color: white;
        border-top-right-radius: 4px;
      }
      
      .mintchat-message__sources {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      
      .mintchat-source-chip {
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 6px;
        border: 1px solid #d1d5db;
        color: #374151;
        background: white;
        cursor: pointer;
        transition: all 150ms;
      }
      
      .mintchat-source-chip:hover {
        background: #f9fafb;
      }
      
      /* Typing Indicator */
      .mintchat-typing {
        display: flex;
        gap: 4px;
        align-items: center;
        padding: 4px 0;
      }
      
      .mintchat-typing span {
        width: 8px;
        height: 8px;
        border-radius: 9999px;
        background: #9ca3af;
        animation: typing-bounce 1.4s infinite ease-in-out;
      }
      
      .mintchat-typing span:nth-child(1) {
        animation-delay: -0.32s;
      }
      
      .mintchat-typing span:nth-child(2) {
        animation-delay: -0.16s;
      }
      
      @keyframes typing-bounce {
        0%, 80%, 100% {
          transform: scale(0.8);
          opacity: 0.5;
        }
        40% {
          transform: scale(1);
          opacity: 1;
        }
      }
      
      /* Suggestions */
      .mintchat-suggestions {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      
      .mintchat-suggestions p {
        font-size: 14px;
        color: #6b7280;
        margin: 0 0 16px 0;
      }
      
      .mintchat-suggestions .space-y-2 {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      
      .mintchat-suggestion-btn {
        width: 100%;
        text-align: left;
        padding: 12px 16px;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
        background: white;
        color: #374151;
        font-size: 14px;
        cursor: pointer;
        transition: all 150ms;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }
      
      .mintchat-suggestion-btn:hover {
        border-color: #d1d5db;
        background: #f9fafb;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      }
      
      /* Tablet (768px - 1024px) */
      @media (max-width: 1024px) and (min-width: 769px) {
        .mintchat-modal {
          width: 85vw;
          max-width: 600px;
          height: 65vh;
          max-height: 480px;
          bottom: 68px;
        }
        
        .mintchat-modal__header h2 {
          font-size: 17px;
        }
        
        .mintchat-modal__content {
          padding: 20px 18px;
        }
        
        .mintchat-message__bubble {
          font-size: 14px;
          padding: 11px 15px;
        }
        
        .mintchat-askbar-wrapper {
          bottom: 16px;
        }
        
        .mintchat-askbar {
          max-width: 340px;
          height: 52px;
        }
        
        .mintchat-askbar__input {
          font-size: 13px;
          height: 22px;
        }
        
        .mintchat-askbar__icon svg,
        .mintchat-askbar__send svg {
          width: 18px;
          height: 18px;
        }
      }
      
      /* Mobile (< 768px) */
      @media (max-width: 768px) {
        .mintchat-modal {
          border-radius: 1.25rem 1.25rem 0 0;
          bottom: 64px;
          height: 60vh;
          max-height: 60vh;
          width: 94vw;
          max-width: 94vw;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .mintchat-modal__header {
          padding: 13px 18px;
        }
        
        .mintchat-modal__header h2 {
          font-size: 16px;
        }
        
        .mintchat-modal__content {
          padding: 18px 14px;
        }
        
        .mintchat-message__bubble {
          font-size: 14px;
          padding: 10px 14px;
        }
        
        .mintchat-message__content {
          max-width: 85%;
        }
        
        .mintchat-askbar-wrapper {
          bottom: 14px;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .mintchat-askbar {
          max-width: 320px;
          height: 48px;
        }
        
        .mintchat-askbar__input {
          font-size: 13px;
          height: 20px;
        }
        
        .mintchat-askbar__icon svg,
        .mintchat-askbar__send svg {
          width: 18px;
          height: 18px;
        }
      }
      
      /* Small Mobile (< 480px) */
      @media (max-width: 480px) {
        .mintchat-modal {
          bottom: 60px;
          height: 58vh;
          max-height: 58vh;
          width: 96vw;
          max-width: 96vw;
          border-radius: 1rem 1rem 0 0;
        }
        
        .mintchat-modal__header {
          padding: 11px 14px;
        }
        
        .mintchat-modal__header h2 {
          font-size: 15px;
        }
        
        .mintchat-modal__content {
          padding: 16px 12px;
        }
        
        .mintchat-message__bubble {
          font-size: 13px;
          padding: 9px 13px;
        }
        
        .mintchat-askbar {
          max-width: 300px;
          height: 46px;
        }
        
        .mintchat-askbar__input {
          font-size: 12px;
          height: 18px;
        }
        
        .mintchat-askbar__icon svg,
        .mintchat-askbar__send svg {
          width: 17px;
          height: 17px;
        }
        
        .mintchat-askbar__send {
          padding: 0.4rem;
        }
      }
      
      /* Landscape Mobile */
      @media (max-width: 768px) and (orientation: landscape) {
        .mintchat-modal {
          bottom: 64px;
          height: 75vh;
          max-height: 75vh;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Create widget HTML
  function createWidget(config) {
    const container = document.createElement('div');
    container.id = 'mintchat-widget-root';
    container.className = 'mintchat-widget';
    
    // Widget will be rendered here by React
    // For now, create a simple version
    container.innerHTML = `
      <div class="mintchat-widget-container">
        <!-- Ask Bar -->
        <div class="mintchat-askbar-wrapper">
          <form class="mintchat-askbar-form">
            <div class="mintchat-askbar ${config.glowingBorder ? 'mintchat-askbar--glow' : ''}" 
                 style="--primary-color: ${config.primaryColor}">
              <button type="button" class="mintchat-askbar__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
              <textarea 
                class="mintchat-askbar__input" 
                placeholder="${config.placeholder}"
                rows="1"
              ></textarea>
              <button type="submit" class="mintchat-askbar__send" style="background-color: ${config.primaryColor}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </form>
        </div>

        <!-- Modal (hidden by default) -->
        <div class="mintchat-modal-backdrop" style="display: none;"></div>
        <div class="mintchat-modal" style="display: none; --primary-color: ${config.primaryColor}">
          <div class="mintchat-modal__header">
            <div class="flex items-center gap-3">
              ${config.logo ? `<img src="${config.logo}" alt="Logo" class="h-8 w-auto" />` : ''}
              <h2 class="text-lg font-semibold text-gray-900">${config.title}</h2>
            </div>
            <button class="mintchat-modal__close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="mintchat-modal__content">
            <div class="mintchat-messages"></div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(container);
    return container;
  }

  // Initialize widget behavior
  function initializeWidget(container, config) {
    const askbar = container.querySelector('.mintchat-askbar');
    const textarea = container.querySelector('.mintchat-askbar__input');
    const form = container.querySelector('.mintchat-askbar-form');
    const modal = container.querySelector('.mintchat-modal');
    const backdrop = container.querySelector('.mintchat-modal-backdrop');
    const closeBtn = container.querySelector('.mintchat-modal__close');
    const messagesContainer = container.querySelector('.mintchat-messages');

    let conversationId = null;
    let isTyping = false;

    // Open modal on first character
    textarea.addEventListener('input', function() {
      if (this.value.length === 1 && this.value.trim()) {
        openModal();
        // Re-focus textarea after modal opens
        setTimeout(() => textarea.focus(), 100);
      }
    });

    // Handle Enter key
    textarea.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    });

    // Open modal
    function openModal() {
      modal.style.display = 'flex';
      backdrop.style.display = 'block';
      
      // Show suggested questions if no messages
      if (messagesContainer.children.length === 0 && config.suggestedQuestions.length > 0) {
        showSuggestedQuestions();
      }
      
      // Focus textarea after modal opens
      setTimeout(() => textarea.focus(), 100);
    }

    // Close modal
    function closeModal() {
      modal.style.display = 'none';
      backdrop.style.display = 'none';
    }

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    // Handle Esc key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeModal();
      }
    });

    // Show suggested questions
    function showSuggestedQuestions() {
      messagesContainer.innerHTML = `
        <div class="mintchat-suggestions">
          <p class="text-sm text-gray-600 mb-4">Here are some questions you can ask:</p>
          <div class="space-y-2">
            ${config.suggestedQuestions.map(q => `
              <button class="mintchat-suggestion-btn" data-question="${q}">
                ${q}
              </button>
            `).join('')}
          </div>
        </div>
      `;

      // Handle suggestion clicks
      messagesContainer.querySelectorAll('.mintchat-suggestion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const question = btn.getAttribute('data-question');
          textarea.value = question;
          handleSubmit(new Event('submit'));
        });
      });
    }

    // Add message to UI
    function addMessage(role, content, sources = []) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `mintchat-message mintchat-message--${role}`;
      
      let html = '';
      
      if (role === 'assistant' && config.showFloatingAvatar) {
        html += `
          <div class="mintchat-message__avatar">
            ${config.avatar ? `<img src="${config.avatar}" alt="AI" />` : '<div>AI</div>'}
          </div>
        `;
      }
      
      html += `
        <div class="mintchat-message__content">
          <div class="mintchat-message__bubble">${content}</div>
          ${sources.length > 0 ? `
            <div class="mintchat-message__sources">
              ${sources.map(s => `
                <span class="mintchat-source-chip">${s.title}</span>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;
      
      if (role === 'user' && config.showFloatingAvatar) {
        html += '<div class="mintchat-message__avatar"><div>U</div></div>';
      }
      
      messageDiv.innerHTML = html;
      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Show typing indicator
    function showTyping() {
      const typingDiv = document.createElement('div');
      typingDiv.className = 'mintchat-typing-indicator';
      typingDiv.innerHTML = `
        <div class="mintchat-message mintchat-message--assistant">
          ${config.showFloatingAvatar ? `
            <div class="mintchat-message__avatar">
              ${config.avatar ? `<img src="${config.avatar}" alt="AI" />` : '<div>AI</div>'}
            </div>
          ` : ''}
          <div class="mintchat-message__content">
            <div class="mintchat-message__bubble">
              <div class="mintchat-typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div>
      `;
      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function hideTyping() {
      const typing = messagesContainer.querySelector('.mintchat-typing-indicator');
      if (typing) typing.remove();
    }

    // Handle form submit
    async function handleSubmit(e) {
      e.preventDefault();
      
      const message = textarea.value.trim();
      if (!message || isTyping) return;

      // Clear suggestions
      const suggestions = messagesContainer.querySelector('.mintchat-suggestions');
      if (suggestions) suggestions.remove();

      // Add user message
      addMessage('user', message);
      
      // Clear input
      textarea.value = '';

      // Show typing
      isTyping = true;
      showTyping();

      try {
        // Send to API
        const response = await sendMessage(message, conversationId);
        
        // Update conversation ID
        if (response.conversationId) {
          conversationId = response.conversationId;
        }

        // Hide typing
        hideTyping();

        // Add assistant message
        addMessage('assistant', response.message.content, response.message.sources || []);
      } catch (error) {
        hideTyping();
        addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
      } finally {
        isTyping = false;
      }
    }

    form.addEventListener('submit', handleSubmit);
  }

  // Ensure viewport meta tag for mobile
  function ensureViewport() {
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(viewport);
    }
  }

  // Main initialization
  async function init(botIdParam) {
    if (!botIdParam) {
      console.error('MintChat: Bot ID is required. Get your Bot ID from the dashboard.');
      return;
    }

    botId = botIdParam;
    console.log('MintChat: Initializing widget with Bot ID:', botId);
    
    // Ensure viewport for mobile
    ensureViewport();

    // Load configuration
    widgetConfig = await loadConfig(botId);
    if (!widgetConfig) {
      console.error('MintChat: Failed to load widget configuration. Please check your Bot ID.');
      return;
    }

    console.log('MintChat: Configuration loaded successfully');

    // Inject styles
    injectStyles();

    // Create widget
    const container = createWidget(widgetConfig);

    // Initialize behavior
    initializeWidget(container, widgetConfig);

    console.log('MintChat: Widget initialized successfully ✓');
  }

  // Expose global API
  window.MintChat = {
    init: init,
    version: '1.0.0',
  };
})();
