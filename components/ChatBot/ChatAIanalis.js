import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/chatbot.module.css'; 

const Chatbot = () => {
    const [userInput, setUserInput] = useState('');
    const [chatOutput, setChatOutput] = useState([{ type: 'bot', text: 'Halo! Ada yang bisa saya bantu?' }]); // Chat sapaan otomatis
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [templates] = useState([
        'Ada berapa jumlah sekolah yang terdaftar di smart e school?',
        'Berikan daftar nama 5 sekolah yang terdaftar di smart e school!',
        'Berikan daftar nama 3 siswa yang terdaftar!',
        'Berikan daftar 3 jurusan yang terdaftar!'
    ]); 
    const [welcomePageVisible, setWelcomePageVisible] = useState(true); 
    const [showChatOutput, setShowChatOutput] = useState(false); 

    const chatRef = useRef(null);
    const inputRef = useRef(null);

    const escapeHTML = (text) => {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;',
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    };

    const sendMessage = (input) => {
        const inputToSend = input || userInput; 
        console.log('Input yang dikirim:', inputToSend); 
        if (inputToSend.trim() === "") return; 

        const escapedInput = escapeHTML(inputToSend);
        setChatOutput((prev) => [...prev, { type: 'user', text: escapedInput }]);
        setUserInput('');
        setWelcomePageVisible(false); 
        setShowChatOutput(true); 

        const loadingId = Date.now();
        setChatOutput((prev) => [...prev, { type: 'loading', id: loadingId }]);

        const imageKeywords = ["buat gambar", "gambar", "buatkan gambar", "gambar ini", "tolong gambar", "bisa gambar"];
        const isImageRequest = imageKeywords.some(keyword => escapedInput.toLowerCase().includes(keyword));

        const fetchData = async () => {
            const endpoint = isImageRequest ? 'http://127.0.0.1:5000/generate_image' : 'http://127.0.0.1:5000/ask';
            const body = isImageRequest ? { prompt: escapedInput } : { query: escapedInput };

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                const data = await response.json();

                setChatOutput((prev) => prev.filter((msg) => msg.id !== loadingId));

                if (isImageRequest) {
                    if (data.image_url) {
                        setChatOutput((prev) => [...prev, { type: 'bot', text: `Berikut adalah gambar yang Anda minta:`, imageUrl: data.image_url }]);
                    } else {
                        setChatOutput((prev) => [...prev, { type: 'bot', text: `Terjadi kesalahan saat membuat gambar: ${data.error}` }]);
                    }
                } else {
                    setChatOutput((prev) => [...prev, { type: 'bot', text: formatResponse(data.response) }]);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    };

    const formatResponse = (response) => {
        let formattedResponse = response.replace(/\n/g, '<br>');
        const urlPattern = /(https?:\/\/[^\s]+)/g;
        formattedResponse = formattedResponse.replace(urlPattern, '<a href="$1" target="_blank">$1</a>');
        return formattedResponse;
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage(userInput); 
        }
    };

    const handleTemplateClick = (template, isGetAnswer) => {
        setUserInput(template); 
        if (isGetAnswer) {
            sendMessage(template); 
        }
    };
    
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chatOutput]);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    const startNewChat = () => {
        setUserInput(''); 
        setChatOutput([{ type: 'bot', text: 'Halo! Ada yang bisa saya bantu?' }]);
        setWelcomePageVisible(true); 
        setShowChatOutput(false); 

        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div className={styles.appContainer}>
             {/* Sidebar */}
            <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed}`}>
                <button onClick={toggleSidebar} className={styles.toggleButton}>
                    {isSidebarOpen ? '←' : '→'}
                </button>
                
                <div className={styles.sidebarHeader}>
                    <img src="/img/ss-logo-icon.png" alt="Logo" className={styles.logo} />
                    Smarteschool
                </div>
                <ul className={styles.sidebarMenu}>
                    <li>
                        <img src="/img/ss-logo-icon.png" alt="Icon 1" className={styles.sidebarIcon} />
                        How to write an impacting ...
                    </li>
                    <li>
                        <img src="/img/ss-logo-icon.png" alt="Icon 2" className={styles.sidebarIcon} />
                        Web accessibility
                    </li>
                    <li>
                        <img src="/img/ss-logo-icon.png" alt="Icon 3" className={styles.sidebarIcon} />
                        Design inspiration
                    </li>
                    <li>
                        <img src="/img/ss-logo-icon.png" alt="Icon 4" className={styles.sidebarIcon} />
                        What is machine learning
                    </li>
                </ul>
                <div>
                <button className={styles.sidebarButton} onClick={startNewChat}>
                        <img src="/img/icon-plus.svg" alt="Chat Icon" className={styles.sidebarIcon} />
                        Start a new chat
                    </button>
                </div>
                <div className={styles.sidebarFooter}>
                    <button>Clear all conversations</button>
                    <button>Switch Light Mode</button>
                    <button>Update & Faq</button>
                    <button>Log out</button>
                </div>
            </div>

            {/* Main Content Container */}
            <div className={styles.mainContentContainer}>
                {/* Main Content Chatbot */}
                <div className={styles.mainContent}>
                    <div className={styles.logoContainer}> {/* Logo di dalam main content */}
                        <img src="/img/ss-logo-icon.png" alt="Logo" className={styles.logoSmall} />
                    </div>

                    {/* Welcome Page */}
                    {welcomePageVisible && (
                        <div className={styles.welcomePage}>
                            <h1 className={styles.hello}>Hello, Boss!</h1>
                            <h1 className={styles.can}>What can I help you?</h1>
                            <p className={styles.p}>Ask me anything what's on your mind. <br></br> I am here to assist you!</p>
                        </div>
                    )}
                    
                    {/* Chat Output */}
                    {showChatOutput && (
                        <div className={`${styles.chatOutput}`} ref={chatRef}>
                            {chatOutput.map((msg, index) => (
                                <div 
                                    key={index} 
                                    className={`${styles.messageContainer} ${msg.type === 'user' ? styles.userWrapper : styles.botWrapper}`}>
                                    {msg.type === 'user' ? (
                                        <p className={styles.userMessage}>{msg.text}</p>
                                    ) : msg.type === 'loading' ? (
                                        <p className={styles.botMessage}>
                                            <span className={styles.loadingDots}>
                                                <span>●</span><span>●</span><span>●</span>
                                            </span>
                                        </p>
                                    ) : (
                                        <p className={styles.botMessage} dangerouslySetInnerHTML={{ __html: msg.text }}></p>
                                    )}
                                </div>  
                            ))}
                        </div>
                    )}

                    {/* Input Chatbot */}
                    <div className={styles.chatInputArea}>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                ref={inputRef} 
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Tanyakan sesuatu..."
                                className={styles.chatInput} 
                            />
                            <button className={styles.sendButton} onClick={() => sendMessage(userInput)}>
                                <i className="bi bi-send-fill"></i>
                                <img src="/img/icon-terkirim-surel.svg" alt="Logo" className={styles.sidebarIcon} />
                            </button>
                        </div>
                    </div>


                    <div className={styles.templateQuestions}>
                        {welcomePageVisible && (
                            <ul>
                                {templates.map((template, index) => (
                                    <li key={index}>
                                        <div className={styles.templateContainer}>
                                            <span className={styles.templateText}>{template}</span>
                                            <div className={styles.buttonContainer}>
                                            <button 
                                                    className={styles.getAnswerButton} 
                                                    onClick={() => handleTemplateClick(template, true)} 
                                                >
                                                    Get Answer
                                                </button>
                                                <button 
                                                    className={styles.editPromptButton} 
                                                    onClick={() => handleTemplateClick(template, false)} 
                                                >
                                                    Edit Prompt
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
