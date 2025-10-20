/**
 * MintChat Widget - Standalone Embed Script
 * This script loads the chat widget on any website
 */

(function() {
  'use strict';

  // Configuration
  const API_BASE = window.location.origin;
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
      const response = await fetch(`${API_BASE}/api/widget/${botIdParam}/config`);
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

  // Inject CSS
  function injectStyles() {
    if (document.getElementById('mintchat-styles')) return;

    const link = document.createElement('link');
    link.id = 'mintchat-styles';
    link.rel = 'stylesheet';
    link.href = `${API_BASE}/widget.css`;
    document.head.appendChild(link);
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

    // Auto-expand textarea
    textarea.addEventListener('input', function() {
      this.style.height = '56px';
      this.style.height = Math.min(this.scrollHeight, 120) + 'px';
      
      // Open modal on first character
      if (this.value.length === 1 && this.value.trim()) {
        openModal();
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
      textarea.style.height = '56px';

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

  // Main initialization
  async function init(botIdParam) {
    if (!botIdParam) {
      console.error('MintChat: Bot ID is required');
      return;
    }

    botId = botIdParam;

    // Load configuration
    widgetConfig = await loadConfig(botId);
    if (!widgetConfig) {
      console.error('MintChat: Failed to initialize widget');
      return;
    }

    // Inject styles
    injectStyles();

    // Create widget
    const container = createWidget(widgetConfig);

    // Initialize behavior
    initializeWidget(container, widgetConfig);

    console.log('MintChat: Widget initialized successfully');
  }

  // Expose global API
  window.MintChat = {
    init: init,
    version: '1.0.0',
  };
})();
