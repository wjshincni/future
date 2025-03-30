/**
        const msg = {
            text: "额 肚肚 我爱你 嘻嘻",
            isUser: false,
            timestamp: Date.now()
        };
        chatHistory.push(msg);
        或
        chatHistory.push({
            text: "",
            isUser: false,
            timestamp: Date.now()
        })
 */

const ACCESS_PASSWORD = "20250228";
let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
const API_KEY = '868ffe977d3b445b541e7e28acb51e41';

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
        messageInput.placeholder = '我好想你，我们要在一起很长很长一段时间';
        document.querySelector('.input-area').classList.remove('hidden');
        chatHistory.push({
            text: "以下是真入回复",
            isUser: false,
            timestamp: Date.now()
        })
        loadHistory();
    } else {
        document.getElementById('passwordInput').value = '';
        document.querySelector('.auth-box').classList.add('rotate');
        setTimeout(() => {
            document.querySelector('.auth-box').classList.remove('rotate');
        }, 2000)
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

// 发送消息并获取机器人回复
async function sendMessage(text) {
    try {
        // 保存用户消息
        const userMsg = {
            text: text,
            isUser: true,
            timestamp: Date.now()
        };
        chatHistory.push(userMsg);
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        createMessageElement(text, true, Date.now());

        // 调用天行机器人API
        const response = await fetch('https://apis.tianapi.com/robot/index', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                key: API_KEY,
                question: text,
                mode: 1, // 闲聊模式
                datatype: 0 // 返回文本格式
            })
        });

        const data = await response.json();
        
        if(data.code === 200) {
            // 保存机器人回复
            const botMsg = {
                text: data.result.reply,
                isUser: false,
                timestamp: Date.now()
            };
            chatHistory.push(botMsg);
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
            
            // 显示机器人回复
            setTimeout(() => {
                createMessageElement(data.result.reply, false, Date.now());
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }, 1500);
        }
    } catch (error) {
        console.error('API fecthes failed!', error);
        // 显示默认回复
        const fallbackReply = {
            text: "额 肚肚 网不好 嘻嘻",
            isUser: false,
            timestamp: Date.now()
        };
        chatHistory.push(fallbackReply);
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        createMessageElement(fallbackReply.text, false, Date.now());
    }
}

// 事件监听
document.getElementById('sendButton').addEventListener('click', () => {
    const text = messageInput.value.trim();
    if(text) {
        sendMessage(text);
        messageInput.value = '';
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
});

messageInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        document.getElementById('sendButton').click();
    }
});

