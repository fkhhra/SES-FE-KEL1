import { useEffect, useRef, useState } from 'react';
import Head from "next/head";
import styles from '../../styles/chatbot.module.css';
import { getProfil } from "../../client/sharedClient";
import { FiMenu, FiPlus, FiTrash2, FiSun, FiInfo, FiLogOut, FiMessageSquare, FiSend, FiMic, FiStopCircle, FiMoon, FiFile } from 'react-icons/fi';
import { openAIResponse, getChatrooms, deleteAllChatrooms, deleteChatroomById, getMessagesByChatroomId, getSuggetions, postInvalidIntent } from '../../client/ChatbotClient';
import { getUser } from 'client/UserClient';
import { useRouter } from "next/router";
import { ssURL } from "../../client/clientAxios";
import { logout } from "client/AuthClient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Chatbot = () => {
  const router = useRouter();
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const [dataUser, setDataUser] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [chatOutput, setChatOutput] = useState([]);
  const [showChatOutput, setShowChatOutput] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [welcomePageVisible, setWelcomePageVisible] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const roleUser = dataUser?.user?.role;
  const namaUser = dataUser?.user?.nama;

  const [selectedChatroomId, setSelectedChatroomId] = useState(null);

  const [chatrooms, setChatrooms] = useState([]);

  // suggestion needs
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [debouncedInput, setDebouncedInput] = useState(userInput);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenuData = () => {
    setMenuVisible(!menuVisible);
  };

  // const handleMenuData = (menu) => {
  //   setUserInput(menu) 
  // }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedInput(userInput), 500);
    return () => clearTimeout(handler);
  }, [userInput]);

  // Fetch suggestions when debouncedInput changes
  useEffect(() => {
    if (debouncedInput && !isInputComplete(debouncedInput) && chatOutput.length === 0 && selectedChatroomId === null) {
      fetchSuggestions(debouncedInput);
    } else {
      setSuggestions([]);
    }
  }, [debouncedInput, chatOutput, selectedChatroomId]);

  // Fetch suggestions from OpenAI API
  const fetchSuggestions = async (inputValue) => {
    setLoadingSuggestions(true);
    try {
      const { data: suggestionsList } = await getSuggetions(inputValue);

      setSuggestions(suggestionsList.data || []);
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

  const isInputComplete = (value) => /[.!?]$/.test(value);

  const handleInputChange = (event) => {
    const value = event.target.value;
    // console.log("User input:", value);
    if (value?.length <= 500) setUserInput(value);
  };

  const normalizeInput = (input) =>
    input
      .normalize("NFKC")
      .replace(/[*+^${}()|[\]\\]/g, "\\$&");

  // Fungsi untuk membuat bagian yang cocok menjadi bold
  const highlightMatch = (suggestion) => {
    const safeInput = normalizeInput(userInput);
    const regex = new RegExp(`(${safeInput})`, "gi");
    const parts = suggestion.split(regex);

    return parts?.map((part, index) =>
      part.toLowerCase() === userInput.toLowerCase() ? (
        <strong key={index}>{part}</strong>
      ) : (
        part
      )
    );
  };
  // Suggestion End

  // function untuk menampilkan pesan user
  const showMessages = async (id) => {
    const { data: messages } = await getMessagesByChatroomId(id);
    if (messages) {
      setWelcomePageVisible(false);
      setChatOutput(messages.data);
      setShowChatOutput(true);
      setSelectedChatroomId(id);
    }
  }

  // function untuk menghapus chatroom bedasarkan id yang dipilih
  const deleteUserChatroomById = async (id) => {
    await deleteChatroomById(id);
    const updatedChatrooms = chatrooms.filter(chatroom => chatroom.id !== id);
    setChatrooms(updatedChatrooms);
    startNewChat();
  }

  // function untuk menghapus semua chatroom
  const deleteAllUserChatrooms = async () => {
    await deleteAllChatrooms();
    setChatrooms([]);
  }

  // function untuk mengirim pesan user dan mendapatkan OpenAI Response
  const sendMessageII = async (input) => {
    const inputToSend = input || userInput;
    if (inputToSend.trim() === "") return;

    const escapedInput = escapeHTML(normalizeInput(inputToSend));
    // console.log("escapedinput:", escapedInput);
    const newMessages = [...chatOutput, { role: 'user', content: escapedInput }];
    setChatOutput(newMessages);
    setUserInput('');
    setWelcomePageVisible(false);
    setShowChatOutput(true);
    setLoadingMessage(true);
    console.log(loadingMessage);

    try {
      // Send request to backend using openAIResponse
      const { data: responseOpenAI } = await openAIResponse({
        message: escapedInput,
        chatroom_id: selectedChatroomId || null
      });

      if (responseOpenAI.status === "success") {
        const chatroom_id = responseOpenAI.chatroomId || selectedChatroomId;
        setSelectedChatroomId(responseOpenAI.chatroomId);
        const { data: messages } = await getMessagesByChatroomId(chatroom_id);
        setChatOutput(messages.data);
        const { data: dataChatrooms } = await getChatrooms();
        setChatrooms(dataChatrooms.data);
      } else {
        // Handle backend failure response
        const updatedMessages = [...newMessages, { role: 'assistant', content: 'Maaf, saya tidak bisa menjawab saat ini.' }];
        setChatOutput(updatedMessages);
      }
      setLoadingMessage(false);
    } catch (error) {
      console.error("Error FE:", error.message);

      // Remove loading indicator and show error message
      setLoadingMessage(false);
      // const updatedMessages = [...newMessages, { role: 'assistant', content: 'Maaf, AI analis tidak dapat menjawab hal tersebut. Mungkin anda kekurangan informasi seperti nama sekolah, nama kelas, nama mapel, atau nama siswa. Harap ajukan kembali pertanyaan dengan informasi yang lebih lengkap dan jelas.' }];
      const updatedMessages = [...newMessages, { role: 'assistant', content: 'Maaf, saya tidak bisa menjawab saat ini. Sepertinya ada kesalahan dalam proses menjawab pertanyaan anda. Silakan coba lagi nanti.' }];
      setChatOutput(updatedMessages);
    }
  };

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

  const formatResponse = (response) => {
    let formattedResponse = response.replace(/\n/g, '<br>');
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    formattedResponse = formattedResponse.replace(urlPattern, '<a href="$1" target="_blank">$1</a>');
    return formattedResponse;
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessageII(userInput);
    }
  };

  const handleTemplateClick = (template, isGetAnswer) => {
    setUserInput(template);
    if (isGetAnswer) {
      sendMessageII(template);
    }
  };

  const startNewChat = () => {
    setUserInput('');
    setChatOutput([])
    setWelcomePageVisible(true);
    setShowChatOutput(false);
    setSelectedChatroomId(null);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const [isOpen, setIsOpen] = useState(true);

  const [recognition, setRecognition] = useState(null);

  const [isRecording, setIsRecording] = useState(false);

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
    const fetchData = async () => {
      try {
        const { data: dataUser } = await getProfil();

        setDataUser(dataUser);
        const { data: dataChatrooms } = await getChatrooms();
        setChatrooms(dataChatrooms.data);

      } catch (error) {
        console.error('Error:', error);
        router.push(`${ssURL}/login`);

      }
    }
    fetchData();
  }, []);

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

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatOutput]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognitionInstance = new window.webkitSpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'id-ID';

      recognitionInstance.onresult = (event) => {
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

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    setIsDarkMode(theme === 'dark');
  }, []);

  // Mode Gelap/Terang
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode]);

  const handleLogout = async (e) => {
    e.preventDefault();

    const payload = { user_id: dataUser.user?.id };

    const { data } = await logout(payload);
    if (data) {
      localStorage.removeItem("ss-token");
      router.push(`${ssURL}/login`);
      toast.success(data?.message);
    }
  };

  // REPORT INVALID RESPONSE
  const reportResponse = [
    { label: "AI General", intent: "text_question" },
    { label: "AI Analsyt", intent: "sql_request" },
    { label: "AI Generates Image", intent: "image_request" },
    { label: "AI Generates File", intent: "file_request" },
  ];

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [reportedMessage, setReportedMessage] = useState(null);

  const openReportModal = (msg) => {
    setReportedMessage(msg);
    setIsReportOpen(true);
  };

  const handleReport = async () => {
    if (selectedReason && reportedMessage) {
      console.log("Laporan terkirim:", { content: reportedMessage.content, intent: selectedReason });

      // Kirim ke backend (Opsional)

      try {
        await postInvalidIntent({
          content: reportedMessage.content,
          intent: selectedReason
        })
      } catch (error) {
        console.log(error)
      }

      setIsReportOpen(false);
    }
  };

  return (
    <>
      <Head>
        <title>ChatAI</title>
        <link rel="shortcut icon" href={dataUser?.user?.sekolah?.favicon} />
      </Head>
      <div className={`${styles.appContainer} ${isDarkMode ? styles.dark : styles.light}`}>
        {/* SideBar */}
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
                {chatrooms?.map((chat) => (
                  <div key={chat.id} className={styles.selectChatContainer}>
                    <li
                      onClick={() => showMessages(chat.id)}
                      className={`${styles.chatItem} ${selectedChatroomId === chat.id ? styles.selectedChatItem : ''}`}
                    >
                      <FiMessageSquare className={styles.chatIcon} />
                      {chat.name}
                    </li>
                    <FiTrash2 className={styles.deleteHistoyChat} onClick={() => deleteUserChatroomById(chat.id)} />
                  </div>
                ))}
              </ul>
            ) : (
              <div className={styles.singleIcon} onClick={() => setIsOpen(true)}>
                <FiMessageSquare className={styles.chatIcon} />
                {/* Menampilkan jumlah chat jika perlu */}
                <span>{chatrooms?.length}</span>
              </div>
            )}

            <button className={styles.startChat} onClick={startNewChat}>
              <FiPlus className="text-xl" />
              {isOpen && <span className="ml-2">Start a New Chat</span>}
            </button>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <button className={styles.footerButton} onClick={() => deleteAllUserChatrooms()}>
              <FiTrash2 className={styles.icon} />
              {isOpen && <span>Clear All Conversations</span>}
            </button>

            <div className={styles.footerButton}>
              <label htmlFor="theme-toggle">
                {isDarkMode ?
                  <div>
                    <FiMoon className={styles.icon} />
                    {isOpen && "Dark Mode"}
                  </div>
                  :
                  <div>
                    <FiSun className={styles.icon} />
                    {isOpen && "Light Mode"}
                  </div>
                }
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

            <button className={styles.footerButton} onClick={(e) => handleLogout(e)}>
              <FiLogOut className={styles.icon} />
              {isOpen && <span>Logout</span>}
            </button>
          </div>
        </div>

        {/* Main Content Container */}
        <div className={styles.mainContentContainer}>
          {/* Main Content Chatbot */}
          <div className={styles.mainContent}>
            {/* Navbar Mobile */}
            <div className={`${styles.navMobile}`}>
              <div className={styles.navMenuButton} onClick={toggleMenu}>
                <img src="/img/MenuAILogo.png" alt="Logo" />
              </div>
              <img src="/img/LogoSeSAI.png" alt="Logo" />
              <div className={styles.transButton}>
              </div>
            </div>
            {/* Floating Menu */}
            {isMenuOpen && (
              <div className={styles.floatingMenu}>
                {isOpen ? (
                  <ul className={styles.chatHistory}>
                    {chatrooms?.map((chat) => (
                      <div key={chat.id} className={styles.selectChatContainer}>
                        <li
                          onClick={() => showMessages(chat.id)}
                          className={`${styles.chatItem} ${selectedChatroomId === chat.id ? styles.selectedChatItem : ''}`}
                        >
                          <FiMessageSquare className={styles.chatIcon} />
                          {chat.name}
                        </li>
                        <FiTrash2 className={styles.deleteHistoyChat} onClick={() => deleteUserChatroomById(chat.id)} />
                      </div>
                    ))}
                  </ul>
                ) : (
                  <div className={styles.singleIcon} onClick={() => setIsOpen(true)}>
                    <FiMessageSquare className={styles.chatIcon} />
                    {/* Menampilkan jumlah chat jika perlu */}
                    <span>{chatrooms?.length}</span>
                  </div>
                )}
                <button className={styles.startChat} onClick={startNewChat}>
                  <FiPlus className="text-xl" />
                  {isOpen && <span className="ml-2">Start a New Chat</span>}
                </button>
                <div className={styles.footer}>
                  <button className={styles.footerButton} onClick={() => deleteAllUserChatrooms()}>
                    <FiTrash2 className={styles.icon} />
                    {isOpen && <span>Clear All Conversations</span>}
                  </button>

                  <div className={styles.footerButton}>
                    <label htmlFor="theme-toggle">
                      {isDarkMode ?
                        <div>
                          <FiMoon className={styles.icon} />
                          {isOpen && "Dark Mode"}
                        </div>
                        :
                        <div>
                          <FiSun className={styles.icon} />
                          {isOpen && "Light Mode"}
                        </div>
                      }
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

                  <button className={styles.footerButton} onClick={(e) => handleLogout(e)}>
                    <FiLogOut className={styles.icon} />
                    {isOpen && <span>Logout</span>}
                  </button>
                </div>
              </div>
            )}
            <div className={`${styles.mobileContainer} ${styles.dekstopContainer}`}>
              {/* Logo */}
              <div className={styles.logoContainer}>
                <img src="/img/ss-logo-icon.png" alt="Logo" className={styles.logoSmall} />
              </div>

              {/* Welcome Page */}
              {welcomePageVisible && (
                <div className={styles.welcomePage}>
                  <h1 className={styles.hello}>Hello, {namaUser}!</h1>
                  <h1 className={styles.can}>What can I help you?</h1>
                  <p className={styles.p}>Ask me anything what's on your mind. <br></br> I am here to assist you!</p>
                </div>
              )}

              {/* Chat Output */}
              {showChatOutput && (
                <div className={`${styles.chatOutput}`} ref={chatRef}>
                  {chatOutput?.map((msg, index) => (
                    <div
                      key={msg.id}
                      className={`${styles.messageContainer} ${msg.role === 'user' ? styles.userWrapper : styles.botWrapper}`}>
                      {msg.role === 'user' ? (
                        <p className={styles.userMessage}>{msg.content}</p>
                      ) : (
                        // <p className={styles.botMessage} dangerouslySetInnerHTML={{ __html: formatResponse(msg.content) }}></p>
                        <div className={styles.botMessageContainer}>
                          <p className={styles.botMessage} dangerouslySetInnerHTML={{ __html: formatResponse(msg.content) }}></p>

                          {/* Icon Report */}
                          {index === chatOutput.length - 1 && (
                            <button className={styles.reportButton} onClick={() => openReportModal(chatOutput[index - 1])}>
                              🚩
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {loadingMessage && (
                    <div className={`${styles.messageContainer} ${styles.botWrapper}`}>
                      <p className={styles.botMessage}>
                        <span className={styles.loadingDots}>
                          <span>●</span><span>●</span><span>●</span>
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Modal Report */}
                  {isReportOpen && (
                    <div className={styles.modalOverlay}>
                      <div className={styles.modalContent}>
                        <h3>Laporkan Pesan</h3>
                        <p>Pilih respon chatbot yang seharusnya:</p>

                        {reportResponse.map((reason, index) => (
                          <label key={index} className={styles.radioLabel}>
                            <input type="radio" name="reportReason" value={reason.intent} onChange={(e) => setSelectedReason(e.target.value)} />
                            {reason.label}
                          </label>
                        ))}

                        <div className={styles.modalActions}>
                          <button onClick={() => setIsReportOpen(false)}>Batal</button>
                          <button onClick={handleReport}>Kirim</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Input Chatbot */}
              <div className={styles.chatInputArea}>
                {/* Menu Pop-up */}
                {menuVisible && (
                  <ul className={styles.popupMenu}>
                    <li onClick={() => { setUserInput("Kurikulum"); setMenuVisible(false); }}>Kurikulum</li>
                    <li onClick={() => { setUserInput("Kesiswaan"); setMenuVisible(false); }}>Kesiswaan</li>
                    <li onClick={() => { setUserInput("Sarpras"); setMenuVisible(false); }}>Sarpras</li>
                    <li onClick={() => { setUserInput("Humas"); setMenuVisible(false); }}>Humas</li>
                    <li onClick={() => { setUserInput("Tata Usaha"); setMenuVisible(false); }}>Tata Usaha</li>
                    <li onClick={() => { setUserInput("Ujian"); setMenuVisible(false); }}>Ujian</li>
                  </ul>
                )}
                {/* Input */}
                <div className={styles.inputContainer}>
                  {/* <button className={styles.fileButton} onClick={toggleMenuData}>
                    <FiFile />
                  </button> */}
                  <input
                    ref={inputRef}
                    className={styles.chatInput}
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    placeholder="Tanyakan sesuatu..."
                    disabled={loadingMessage}
                  />
                  <button className={styles.micButton} onClick={handleMicClick}>
                    {isRecording ? <FiStopCircle /> : <FiMic />}
                  </button>
                  <button className={styles.sendButton} onClick={() => sendMessageII(userInput)} disabled={loadingMessage}>
                    <FiSend />
                  </button>
                </div>

                {/* Suggestions dropdown */}
                {/* {loadingSuggestions && <p>Loading suggestions...</p>} */}
                {suggestions.length > 0 && (
                  <ul className={styles.suggestionsList}>
                    {suggestions?.map((suggestion, index) => (
                      <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                        {highlightMatch(suggestion)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Template Questions */}
              <div className={styles.templateQuestions}>
                {welcomePageVisible && (
                  <ul>
                    {templates?.map((template, index) => (
                      <li key={index}>
                        <div className={styles.templateContainer}>
                          <span className={styles.templateText}>{template}</span>
                          <div className={styles.buttonContainer}>
                            <button
                              className={styles.getAnswerButton}
                              onClick={() => handleTemplateClick(template, true)}
                              disabled={loadingMessage}
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
      </div>
    </>
  );
};

export default Chatbot;