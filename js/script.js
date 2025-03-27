        // 配置参数
        const ACCESS_PASSWORD = "20250228";
        let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];

        // DOM元素
        const authOverlay = document.getElementById('authOverlay');
        const chatContainer = document.getElementById('chatContainer');
        const messageInput = document.getElementById('messageInput');

        // 密码验证
        document.getElementById('joinButton').addEventListener('click', () => {
            const input = document.getElementById('passwordInput').value;
            if(input === ACCESS_PASSWORD) {
                authOverlay.classList.add('hidden');
                chatContainer.classList.remove('hidden');
                document.getElementById('inputArea').classList.remove('hidden');
                loadHistory();
            } else {
                alert('密码错误！');
            }
        });

        // 加载历史记录
        function loadHistory() {
            chatHistory.forEach(msg => createMessageElement(msg.text, msg.isUser, msg.timestamp));
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        // 创建消息元素
        function createMessageElement(text, isUser, timestamp) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user' : ''}`;
            
            const time = new Date(timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit'
            });

            messageDiv.innerHTML = `
                <div class="bubble">
                    ${text}
                    <div class="timestamp">${time}</div>
                </div>
            `;
            chatContainer.appendChild(messageDiv);
        }

        // 发送消息
        document.getElementById('sendButton').addEventListener('click', () => {
            const text = messageInput.value.trim();
            $.post('https://apis.tianapi.com/robot/index',
                {
                    key:'868ffe977d3b445b541e7e28acb51e41',
                    question:messageInput.value
                });
            if(text) {
                const msg = {
                    text: text,
                    isUser: true,
                    timestamp: Date.now()
                };
                
                // 保存到本地
                chatHistory.push(msg);
                localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
                
                // 显示消息
                createMessageElement(text, true, Date.now());
                messageInput.value = '';
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        });

        // 回车发送支持
        messageInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                document.getElementById('sendButton').click();
            }
        });