import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/chatbot.module.css';
import { getProfil } from "../../client/sharedClient";
import { FiMenu, FiPlus, FiTrash2, FiSun, FiInfo, FiLogOut, FiMessageSquare, FiSend, FiMic, FiStopCircle, FiMoon } from 'react-icons/fi';

const Chatbot = () => {
    const [userInput, setUserInput] = useState('');
    const [chatOutput, setChatOutput] = useState([{ type: 'bot', text: 'Halo! Ada yang bisa saya bantu?' }]);
    const [templates, setTemplates] = useState([]);
    const [welcomePageVisible, setWelcomePageVisible] = useState(true);
    const [showChatOutput, setShowChatOutput] = useState(false);
    const [history, setHistory] = useState([]);
    const [currentHistoryId, setCurrentHistoryId] = useState(0);
    const [dataUser, setDataUser] = useState(null)
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [previousChats, setPreviousChats] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark');
    // suggestion needs
    const [suggestions, setSuggestions] = useState([]); // For storing suggestions
    const [loadingSuggestions, setLoadingSuggestions] = useState(false); // For suggestion loading state
    const [debouncedInput, setDebouncedInput] = useState(userInput); // For debounced input

    const apiKey = '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';
    const roleUser = dataUser?.user?.role
    const namaUser = dataUser?.user?.nama
    const schoolUser = dataUser?.user?.sekolah?.nama

    // Suggestion Start
    // bisa lebih spesifik, tinggal tambahin data tahun ajaran dari dataUser?.ta
    const userProfileTemplate = `
    Analisa ini dalam membuat saran pencarian yang lebih akurat
        Asal Sekolah : ${schoolUser}
        Jabatan : ${roleUser}
    `;

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedInput(userInput), 500);
        return () => clearTimeout(handler);
    }, [userInput]);

    // Fetch suggestions when debouncedInput changes
    useEffect(() => {
        if (debouncedInput && !isInputComplete(debouncedInput)) {
            fetchSuggestions(debouncedInput);
        } else {
            setSuggestions([]);
        }
    }, [debouncedInput]);

    // Fetch suggestions from OpenAI API
    const fetchSuggestions = async (inputValue) => {
        setLoadingSuggestions(true);
        try {
            const response = await fetch('process.env.OPENAI_API_KEY', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "gpt-4o",
                    messages: [
                        {
                            role: "system", content: `Kamu adalah asisten saran pencarian. ${userProfileTemplate}. Ketika pengguna mengetikkan sebagian kata atau frasa, berikan beberapa ide atau saran pencarian yang relevan. Gunakan bahasa Indonesia dan batasi jawaban hingga 50 token.`
                        },
                        {
                            role: "user",
                            content: `Berikan tiga saran pencarian terkait untuk: "${inputValue}". Tampilkan saran dalam bentuk teks yang langsung terhubung dengan kata/frasa tersebut, tanpa angka atau bullet, dipisahkan dengan garis baru. Format jawaban harus: "${inputValue} {saran}" dan gunakan tanda baca yang sesuai.`,
                        }

                    ],
                    max_tokens: 50,
                }),
            });

            const data = await response.json();
            const suggestionsList = data.choices[0].message.content.split('\n');
            setSuggestions(suggestionsList || []);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setSuggestions([]);
        } finally {
            setLoadingSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setUserInput(suggestion);
        setSuggestions([]);
    };

    const isInputComplete = (value) => /[.!?]$/.test(value); // Check if input is complete

    const handleInputChange = (event) => {
        const value = event.target.value;
        if (value.length <= 40) setUserInput(value); // Limit input length to 40 characters
    };

    // Fungsi untuk membuat bagian yang cocok menjadi bold
    const highlightMatch = (suggestion) => {
        const regex = new RegExp(`(${userInput})`, "gi");
        const parts = suggestion.split(regex);

        return parts.map((part, index) =>
            part.toLowerCase() === userInput.toLowerCase() ? (
                <strong key={index}>{part}</strong>
            ) : (
                part
            )
        );
    };

    // Suggestion End

    useEffect(() => {
        // Mendapatkan data pengguna saat komponen pertama kali di-render
        const fetchData = async () => {
            try {
                const { data } = await getProfil(); // Memanggil fungsi getProfil untuk mengambil data
                setDataUser(data); // Menyimpan data ke dalam state dataUser
            } catch (error) {
                console.error("Error fetching user profile:", error); // Menangani error jika terjadi
            }
        };

        fetchData(); // Memanggil fungsi fetchData untuk melakukan fetch data
    }, []); // Hanya dijalankan sekali saat komponen di-mount

    // templates
    useEffect(() => {
        if (dataUser?.user) {
            switch (roleUser) {
                case 'guru':
                    setTemplates([
                        'Apa manfaat AI dalam pengajaran?',
                        'Bagaimana cara menggunakan teknologi untuk mendukung pembelajaran?',
                        'Apa tantangan dalam mengintegrasikan AI ke dalam kurikulum?',
                    ]);
                    break;
                case 'murid':
                    setTemplates([
                        'Apa itu AI?',
                        'Bagaimana AI bisa membantu dalam belajar sehari-hari?',
                        'Apa saja keterampilan yang bisa dikembangkan dengan bantuan AI?',
                    ]);
                    break;
                case 'admin':
                    setTemplates([
                        'Apa keuntungan menggunakan teknologi AI dalam administrasi sekolah?',
                        'Bagaimana cara mengelola data secara efisien dengan AI?',
                        'Apa saja inovasi teknologi terbaru untuk pengelolaan sekolah?',
                    ]);
                    break;
                case 'kepsek':
                    setTemplates([
                        'Apa dampak teknologi AI pada perkembangan pendidikan?',
                        'Bagaimana AI bisa membantu dalam pengambilan keputusan di sekolah?',
                        'Apa peran teknologi dalam meningkatkan mutu pendidikan?',
                    ]);
                    break;
                default:
                    setTemplates([
                        'Apa itu AI?',
                        'Bagaimana teknologi AI mengubah cara kita bekerja dan belajar?',
                    ]);
                    break;
            }

        }
    }, [dataUser]);

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

    // Function to save history in localStorage
    const saveHistory = (messages) => {
        const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];

        if (currentHistoryId) {
            // Update existing history
            const updatedHistory = chatHistory.map(chat => {
                if (chat.id === currentHistoryId) {
                    // Get existing messages
                    const existingMessages = chat.data.messages;

                    // Filter out any messages that are already in the existingMessages to avoid duplication
                    const newMessages = messages.filter(msg =>
                        !existingMessages.some(existingMsg => existingMsg.text === msg.text && existingMsg.type === msg.type)
                    );

                    // Return updated chat history with new unique messages appended
                    return {
                        ...chat,
                        data: { messages: [...existingMessages, ...newMessages] } // Append only unique messages
                    };
                }
                return chat;
            });

            localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
            setHistory(updatedHistory);
        } else {
            const newId = chatHistory.length ? chatHistory[chatHistory.length - 1].id + 1 : 1;
            const title = messages.filter(msg => msg.type === 'user')[0]?.text.split(' ').slice(0, 3).join(' ') || 'Untitled';
            const newHistoryItem = { id: newId, data: { messages }, title };
            const updatedHistory = [...chatHistory, newHistoryItem];

            localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
            setHistory(updatedHistory);
            setCurrentHistoryId(newId);
        }
    };

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        setHistory(savedHistory);

        // Filter chat sesuai dengan currentHistoryId
        const chatroom = savedHistory.find(room => room.id === currentHistoryId);

        // Jika ditemukan chatroom dengan id yang sesuai, ambil pesan dari chatroom tersebut
        const chatroomChats = chatroom ? chatroom.data.messages : [];
        const updatedChatroomChats = chatroomChats.map(message => ({
            role: message.type === "bot" ? "assistant" : "user",
            content: message.text || message.content
        }));

        setPreviousChats(updatedChatroomChats);
    }, [currentHistoryId]);

    const sendMessage = (input) => {
        const inputToSend = input || userInput;
        if (inputToSend.trim() === "") return;

        const escapedInput = escapeHTML(inputToSend);
        const newMessages = [...chatOutput, { type: 'user', text: escapedInput }];
        setChatOutput(newMessages);
        setUserInput(''); // Reset input field
        setWelcomePageVisible(false);
        setShowChatOutput(true);

        const loadingId = Date.now();
        setChatOutput((prev) => [...prev, { type: 'loading', id: loadingId }]);

        const fetchData = async () => {

            try {
                let response;
                if (inputToSend.toLowerCase().includes("gambar") || inputToSend.toLowerCase().includes("ilustrasi")) {
                    // Jika input mengandung kata 'gambar' atau 'ilustrasi', gunakan OpenAI DALL·E API untuk request gambar
                    response = await fetch('process.env.OPENAI_API_KEY', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`,
                        },
                        body: JSON.stringify({
                            model: "dall-e-3",
                            prompt: inputToSend,  // Input pengguna yang meminta gambar
                            n: 1,  // Jumlah gambar yang dihasilkan
                            size: "1024x1024",  // Ukuran gambar
                            style: "natural",  // gaya gambar
                        }),
                    });

                    const imageData = await response.json();
                    const imageUrl = imageData.data[0].url;

                    setChatOutput((prev) => prev.filter((msg) => msg.id !== loadingId));

                    const updatedMessages = [...newMessages, { type: 'bot', text: `<img src="${imageUrl}" alt="Generated Image" />` }];
                    setChatOutput(updatedMessages);
                    saveHistory(updatedMessages); // Save chat to history
                } else {
                    // Normal text-based response
                    response = await fetch('process.env.OPENAI_API_KEY', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`,
                        },
                        body: JSON.stringify({
                            model: "gpt-4",
                            messages: [...previousChats, { role: "user", content: escapedInput }]
                        }),
                    });

                    const data = await response.json();

                    setChatOutput((prev) => prev.filter((msg) => msg.id !== loadingId));

                    if (data.choices && data.choices.length > 0) {
                        const updatedMessages = [...newMessages, { type: 'bot', text: formatResponse(data.choices[0].message.content) }];
                        setChatOutput(updatedMessages);
                        saveHistory(updatedMessages); // Save chat to history
                    } else {
                        const updatedMessages = [...newMessages, { type: 'bot', text: 'Maaf, saya tidak bisa menjawab saat ini.' }];
                        setChatOutput(updatedMessages);
                        saveHistory(updatedMessages);
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                setChatOutput((prev) => prev.filter((msg) => msg.id !== loadingId));
                setChatOutput((prev) => [...prev, { type: 'bot', text: 'Terjadi kesalahan saat memproses permintaan.' }]);
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

    // Function to load a history chat
    const loadChatFromHistory = (id) => {
        const savedHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        const selectedChat = savedHistory.find(chat => chat.id === id);
        if (selectedChat) {
            setChatOutput(selectedChat.data.messages);
            setWelcomePageVisible(false);
            setShowChatOutput(true);
            setCurrentHistoryId(id);
            setSelectedChatId(id);
        }
    };

    const clearChatSessions = () => {
        localStorage.removeItem('chatHistory');
        setChatOutput([{ type: 'bot', text: 'Halo! Ada yang bisa saya bantu?' }]);
        setWelcomePageVisible(true);
        setShowChatOutput(false);
        setCurrentHistoryId(null);
    };


    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chatOutput]);



    const startNewChat = () => {
        setUserInput('');
        setChatOutput([{ type: 'bot', text: 'Halo! Ada yang bisa saya bantu?' }]);
        setWelcomePageVisible(true);
        setShowChatOutput(false);
        setCurrentHistoryId(null);
        setSelectedChatId(null)

        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const [isOpen, setIsOpen] = useState(true);

    const [recognition, setRecognition] = useState(null);

    const [isRecording, setIsRecording] = useState(false);
    // Fungsi mikrofon (pengenalan suara)
    const handleMicClick = () => {
        if (recognition) {
            if (!isRecording) {
                recognition.start();
            } else {
                recognition.stop();
            }
            setIsRecording(!isRecording);
        }
    };
    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const recognitionInstance = new window.webkitSpeechRecognition();
            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = 'id-ID';

            recognitionInstance.onresult = (event) => {
                // console.log('Hasil pengenalan suara: ', event.results); // Debug hasil pengenalan suara
                setUserInput(event.results[0][0].transcript);
            };

            recognitionInstance.onerror = (event) => {
                console.error('Error occurred in recognition: ', event.error); // Debug error pengenalan suara
                alert(`Error: ${event.error}`);
            };

            setRecognition(recognitionInstance);
        } else {
            alert('Browser tidak mendukung fitur pengenalan suara.');
        }
    }, []);

    const deleteChatFromHistory = (chatId) => {
        // const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        // const updatedChatHistory = chatHistory.filter(chat => chat.id !== chatId);
        const updatedChatHistory = history.filter(chat => chat.id !== chatId);

        localStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));
        if (selectedChatId === chatId) {
            startNewChat()
        }
        setHistory(updatedChatHistory);
        // console.log(updatedChatHistory);
    };

    // Mode Gelap/Terang
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        }
    }, [isDarkMode]);

    // console.log(selectedChatId);

    return (
        <div className={`${styles.appContainer} ${isDarkMode ? styles.dark : styles.light}`}>
            <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
                {/* Header */}
                <div className={styles.header}>
                    {/* Toggle Button */}
                    <button onClick={() => setIsOpen(!isOpen)} className={styles.toggleButton}>
                        <FiMenu />
                    </button>

                    {/* Logo */}
                    <div className={styles.logoSidebar} onClick={() => window.location.href = '/smartschool'}>
                        <img src="/img/ss-logo-icon.png" alt="Logo" className={styles.logo} />
                        {isOpen && <span className="ml-2 text-lg font-semibold">Smarteschool</span>}
                    </div>
                </div>

                {/* Main Section */}
                <div className={styles.main}>
                    {isOpen ? (
                        <ul className={styles.chatHistory}>
                            {history.map((chat) => (
                                <div className={styles.selectChatContainer}>
                                    <li
                                        key={chat.id}
                                        onClick={() => loadChatFromHistory(chat.id)}
                                        className={`${styles.chatItem} ${selectedChatId === chat.id ? styles.selectedChatItem : ''}`}
                                    >
                                        <FiMessageSquare className={styles.chatIcon} />
                                        {chat.title}
                                    </li>
                                    <FiTrash2 className={styles.deleteHistoyChat} onClick={() => deleteChatFromHistory(chat.id)} />
                                </div>
                            ))}
                        </ul>
                    ) : (
                        <div className={styles.singleIcon} onClick={() => setIsOpen(true)}>
                            <FiMessageSquare className={styles.chatIcon} />
                            {/* Menampilkan jumlah chat jika perlu */}
                            <span>{history.length > 0 ? history.length : "0"}</span>
                        </div>
                    )}
                    <button className={styles.startChat} onClick={startNewChat}>
                        <FiPlus className="text-xl" />
                        {isOpen && <span className="ml-2">Start a New Chat</span>}
                    </button>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <button className={styles.footerButton} onClick={clearChatSessions}>
                        <FiTrash2 className={styles.icon} />
                        {isOpen && <span>Clear All Conversations</span>}
                    </button>
                    {/* <button className={styles.footerButton}>
                        <FiSun className={styles.icon} />
                        {isOpen && <span>Switch Light/Dark Mode</span>}
                    </button> */}

                    <div className={styles.footerButton}>
                        <label htmlFor="theme-toggle">
                            {isDarkMode ?
                                <div>
                                    <FiMoon className={styles.icon} />
                                    Dark Mode
                                </div>
                                :
                                <div>
                                    <FiSun className={styles.icon} />
                                    Light Mode
                                </div>} {/* Ikon dan teks untuk menjelaskan */}
                        </label>
                        <input
                            type="checkbox"
                            id="theme-toggle"
                            checked={isDarkMode}
                            onChange={() => setIsDarkMode(!isDarkMode)}
                        />
                    </div>
                    <button className={styles.footerButton}>
                        <FiInfo className={styles.icon} />
                        {isOpen && <span>Update & FAQ</span>}
                    </button>
                    <button className={styles.footerButton}>
                        <FiLogOut className={styles.icon} />
                        {isOpen && <span>Logout</span>}
                    </button>
                </div>
            </div>

            {/* Main Content Container */}
            <div className={styles.mainContentContainer}>
                {/* Main Content Chatbot */}
                <div className={styles.mainContent}>
                    <div className={styles.logoContainer}>
                        <img src="/img/ss-logo-icon.png" alt="Logo" className={styles.logoSmall} />
                    </div>

                    {/* Welcome Page */}
                    {welcomePageVisible && (
                        <div className={styles.welcomePage}>
                            <div className={styles.helloContainer}>
                                <h1 className={styles.hello}>Hello, {namaUser}!</h1>
                            </div>
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
                                ref={inputRef}
                                className={styles.chatInput}
                                type="text"
                                value={userInput}
                                // onChange={(e) => setUserInput(e.target.value)}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyPress}
                                placeholder="Tanyakan sesuatu..."
                            />
                            <button className={styles.micButton} onClick={handleMicClick}>
                                {isRecording ? <FiStopCircle /> : <FiMic />}
                            </button>
                            <button className={styles.sendButton} onClick={() => sendMessage(userInput)}>
                                <FiSend />
                            </button>
                        </div>

                        {/* Suggestions dropdown */}
                        {/* {loadingSuggestions && <p>Loading suggestions...</p>} */}
                        {suggestions.length > 0 && (
                            <ul className={styles.suggestionsList}>
                                {suggestions.map((suggestion, index) => (
                                    <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                                        {highlightMatch(suggestion)}
                                    </li>
                                ))}
                            </ul>
                        )}
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
