document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-btn');
    const nextButton = document.getElementById('next-btn');
    const prevButton = document.getElementById('prev-btn');
    const restartButton = document.getElementById('restart-btn');
    const themeButton = document.getElementById('theme-btn');
    const questionContainerElement = document.getElementById('question-container');
    const questionElement = document.getElementById('question');
    const answerButtonsElement = document.getElementById('answer-buttons');
    const quizContainer = document.getElementById('quiz-container');
    const messageContainer = document.getElementById('message-container');
    const bubblesContainer = document.getElementById('bubbles-container');
    const hiddenHearts = document.querySelectorAll('.hidden-heart');
    const quizImage = document.getElementById('quiz-image');
    
    // Foto para a página inicial
    const initialImage = 'foto.jpeg';
    
    // Foto para a tela final
    const finalImage = 'final.jpeg';
    
    // Array com as 5 fotos diferentes, uma para cada pergunta
    const imageUrls = [
        'foto1.jpeg',
        'foto2.jpeg',
        'foto3.jpeg',
        'foto4.jpeg',
        'foto5.jpeg'
    ];
    
    // Define a imagem inicial na tela de apresentação
    quizImage.style.backgroundImage = `url(${initialImage})`;
    
    // Som de clique em base64
    const clickSoundBase64 = "data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
    
    // Cria o elemento de áudio para o som de clique
    const clickSound = new Audio(clickSoundBase64);
    clickSound.volume = 0.3; // Volume do som (30%)
    
    // Função para aplicar efeito de clique (visual e sonoro)
    function applyClickEffect(button) {
        if (!button) return;
        
        button.addEventListener('click', () => {
            // Efeito sonoro
            playClickSound();
            
            // Efeito visual
            button.classList.add('btn-click-effect');
            setTimeout(() => {
                button.classList.remove('btn-click-effect');
            }, 300);
        });
    }
    
    // Função para reproduzir o som de clique
    function playClickSound() {
        // Clona o som para permitir múltiplos cliques rápidos
        const soundClone = clickSound.cloneNode();
        soundClone.play().catch(e => console.log("Erro ao reproduzir som: ", e));
    }
    
    // Aplica o efeito de clique aos botões fixos
    applyClickEffect(startButton);
    applyClickEffect(prevButton);
    applyClickEffect(restartButton);
    applyClickEffect(themeButton);
    
    // Garante que o botão de voltar esteja oculto inicialmente
    prevButton.classList.add('hide');
    
    // Adiciona um evento de janela para garantir que o botão fique oculto
    window.addEventListener('load', () => {
        // Força a ocultação do botão de voltar na página inicial
        prevButton.classList.add('hide');
    });
    
    // Histórico de respostas para voltar às perguntas anteriores
    let answerHistory = [];
    let shuffledQuestions, currentQuestionIndex;
    let mouseX = 0;
    let mouseY = 0;

    // Inicializa os corações escondidos
    initHiddenHearts();
    
    // Atraso de apenas meio segundo para começar a criar as bolhas
    setTimeout(() => {
        // Cria imediatamente mais bolhas visíveis
        for (let i = 0; i < 50; i++) {
            createBubble();
        }
        
        // Inicia o intervalo para continuar criando bolhas
        setInterval(createBubble, 100);
        
        // Depois cria mais em sequência para ter um efeito visual mais impactante
        setTimeout(() => {
            createInitialBubbles();
        }, 300);
        
        // Verificar periodicamente se há bolhas suficientes na tela
        setInterval(checkAndAddBubbles, 1000);
    }, 500); // Meio segundo
    
    // Rastreamento da posição do mouse
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    startButton.addEventListener('click', startGame);
    
    prevButton.addEventListener('click', () => {
        // Se estiver na primeira pergunta, volta para a tela inicial
        if (currentQuestionIndex === 0) {
            // Esconde o container de perguntas
            questionContainerElement.classList.add('hide');
            // Mostra o botão de início
            startButton.classList.remove('hide');
            // Mostra o quiz container (que contém o título)
            quizContainer.classList.remove('hide');
            // Redefine a imagem para a foto inicial
            quizImage.style.backgroundImage = `url(${initialImage})`;
            // Esconde o botão de voltar
            prevButton.classList.add('hide');
            // Garante que o container de perguntas está realmente oculto
            document.getElementById('question-container').style.display = 'none';
            
            // Mostra novamente o título e o nome do destinatário
            document.querySelector('.title').style.display = 'block';
            document.querySelector('.recipient').style.display = 'block';
            
            // Reseta o estado
            resetState();
            // Prevenimos o comportamento padrão que poderia estar interferindo
            return false;
        } else {
            // Comportamento normal de voltar para a pergunta anterior
            currentQuestionIndex--;
            setPreviousQuestion();
        }
    });
    
    restartButton.addEventListener('click', () => {
        // Oculta a mensagem final
        messageContainer.classList.add('hide');
        // Oculta o container de perguntas
        questionContainerElement.classList.add('hide');
        // Mostra o botão de início
        startButton.classList.remove('hide');
        // Limpa o histórico
        answerHistory = [];
        // Reseta o estado
        resetState();
    });
    
    // Toggle do tema escuro roxo
    themeButton.addEventListener('click', () => {
        const htmlElement = document.documentElement;
        if (htmlElement.classList.contains('dark-theme')) {
            htmlElement.classList.remove('dark-theme');
            htmlElement.classList.add('light-theme');
            themeButton.querySelector('.toggle-icon').textContent = '💞';
        } else {
            htmlElement.classList.remove('light-theme');
            htmlElement.classList.add('dark-theme');
            themeButton.querySelector('.toggle-icon').textContent = '💜';
        }
        // Adiciona animação ao botão ao clicar
        themeButton.classList.add('clicked');
        setTimeout(() => {
            themeButton.classList.remove('clicked');
        }, 300);
    });
    
    // Funções de corações e bolhas
    function initHiddenHearts() {
        hiddenHearts.forEach(heart => {
            // Tornar visível de forma aleatória ao longo do tempo (mais rápido agora)
            setTimeout(() => {
                heart.classList.add('visible');
            }, Math.random() * 5000); // Aparecem em até 5 segundos (antes era 20s)
            
            // Adicionar evento de clique para exibir efeito de explosão
            heart.addEventListener('click', (e) => {
                // Reproduz o som de clique
                playClickSound();
                
                heart.classList.remove('visible');
                createPopEffect(e.clientX, e.clientY, '💕');
                
                // Tornar visível novamente depois de um tempo (mais rápido)
                setTimeout(() => {
                    heart.classList.add('visible');
                }, 1000 + Math.random() * 3000); // 1-4 segundos (antes era 5-15s)
            });
        });
    }
    
    function createInitialBubbles() {
        // Aumentado para 150 bolhas e criadas mais rapidamente
        for (let i = 0; i < 150; i++) {
            setTimeout(() => {
                createBubble();
            }, i * 10); // Reduzido para criar mais rápido
        }
    }
    
    function createBubble() {
        const bubble = document.createElement('div');
        const size = Math.random() * 60 + 40; // Tamanho entre 40px e 100px
        const heartType = getRandomHeart();
        const heartSpan = document.createElement('span');
        heartSpan.classList.add('bubble-heart');
        heartSpan.textContent = heartType;
        
        // Adiciona variação de cor às bolhas para mais decoração
        const hue = Math.floor(Math.random() * 360);
        bubble.style.background = `hsla(${hue}, 100%, 90%, 0.3)`;
        
        bubble.appendChild(heartSpan);
        bubble.classList.add('bubble');
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        // Posição X inicial aleatória
        const startPosX = Math.random() * window.innerWidth;
        bubble.style.left = `${startPosX}px`;
        bubble.style.bottom = `-${size}px`;
        
        // Movimento aleatório para os lados durante a subida
        const randomX = (Math.random() - 0.5) * 200;
        bubble.style.setProperty('--rand-x', `${randomX}px`);
        
        // Velocidade de animação aleatória para mais naturalidade
        const animDuration = Math.random() * 10 + 10; // 10-20 segundos
        bubble.style.animationDuration = `${animDuration}s`;
        
        // Adicionar evento de mouse próximo para fuga
        bubble.addEventListener('mousemove', handleBubbleMouseMove);
        
        // Adicionar evento de clique para estourar a bolha (com som)
        bubble.addEventListener('click', function(e) {
            e.stopPropagation();
            popBubble(bubble, e);
        });
        
        bubblesContainer.appendChild(bubble);
        
        // Remover bolha após a animação para não sobrecarregar o DOM
        setTimeout(() => {
            if (bubble.parentNode === bubblesContainer) {
                bubblesContainer.removeChild(bubble);
            }
        }, animDuration * 1000);
    }
    
    function handleBubbleMouseMove(e) {
        const bubble = e.currentTarget;
        const rect = bubble.getBoundingClientRect();
        const bubbleX = rect.left + rect.width / 2;
        const bubbleY = rect.top + rect.height / 2;
        
        // Calcula a distância entre o mouse e o centro da bolha
        const dx = mouseX - bubbleX;
        const dy = mouseY - bubbleY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Se o mouse estiver próximo, a bolha foge
        if (distance < 150) {
            // Determina a direção oposta para onde a bolha deve ir
            const angle = Math.atan2(dy, dx);
            const moveX = -Math.cos(angle) * 2;
            const moveY = -Math.sin(angle) * 2;
            
            // Aplica o movimento suave com a classe CSS (se ainda não existir)
            if (!bubble.style.transform || !bubble.style.transform.includes('translate')) {
                const currentX = parseFloat(bubble.style.left) || 0;
                const currentY = parseFloat(bubble.style.bottom) || 0;
                
                // Limita o movimento para manter as bolhas na tela
                const newX = Math.max(0, Math.min(window.innerWidth - rect.width, currentX + moveX * 15));
                const newY = Math.max(-rect.height, currentY + moveY * 15);
                
                bubble.style.left = `${newX}px`;
                bubble.style.bottom = `${newY}px`;
            }
        }
    }
    
    function popBubble(bubble, e) {
        // Para a propagação do evento para não acionar múltiplos cliques
        e.stopPropagation();
        
        // Reproduz o som de clique
        playClickSound();
        
        // Obtém o coração atual para o efeito de explosão
        const heartContent = bubble.querySelector('.bubble-heart').textContent;
        
        // Cria o efeito de explosão com mais corações (aumentado)
        createPopEffect(e.clientX, e.clientY, heartContent);
        
        // Adiciona a classe de animação e remove a bolha
        bubble.style.pointerEvents = 'none';
        bubble.style.animation = 'pop 0.5s forwards';
        
        // Remove a bolha após a animação
        setTimeout(() => {
            if (bubble.parentNode === bubblesContainer) {
                bubblesContainer.removeChild(bubble);
            }
        }, 500);
    }
    
    function createPopEffect(x, y, content) {
        const popEffect = document.createElement('div');
        popEffect.classList.add('pop-effect');
        popEffect.style.left = `${x}px`;
        popEffect.style.top = `${y}px`;
        
        // Aumentado para 16 corações em vez de 8
        for (let i = 0; i < 16; i++) {
            const heart = document.createElement('span');
            heart.textContent = content;
            heart.style.position = 'absolute';
            heart.style.fontSize = '1.2rem';
            
            // Posiciona os corações em círculo
            const angle = (i / 16) * 2 * Math.PI;
            const distance = 40; // Aumentado para espalhar mais (era 30)
            heart.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
            
            popEffect.appendChild(heart);
        }
        
        document.body.appendChild(popEffect);
        
        // Remove o efeito após a animação
        setTimeout(() => {
            if (popEffect.parentNode === document.body) {
                document.body.removeChild(popEffect);
            }
        }, 500);
    }
    
    function getRandomHeart() {
        // Adicionados mais tipos de corações
        const hearts = ['❤️', '💖', '💗', '💓', '💘', '💝', '💕', '💞', '💟', '💌', '💓', '💗', '💔', '💋'];
        return hearts[Math.floor(Math.random() * hearts.length)];
    }

    function startGame() {
        startButton.classList.add('hide');
        shuffledQuestions = questions.sort(() => Math.random() - 0.5);
        currentQuestionIndex = 0;
        answerHistory = []; // Limpa o histórico
        
        // Esconde o título e o nome do destinatário durante as perguntas
        document.querySelector('.title').style.display = 'none';
        document.querySelector('.recipient').style.display = 'none';
        
        // Garante que o container de perguntas fique visível
        questionContainerElement.classList.remove('hide');
        questionContainerElement.style.display = 'block';
        
        // Tornando o botão de voltar visível em todas as perguntas
        prevButton.classList.remove('hide');
        
        // Inicia o jogo
        setNextQuestion();
    }

    function saveCurrentAnswerState() {
        // Salva o estado atual das respostas para poder voltar depois
        const currentAnswers = Array.from(answerButtonsElement.children);
        const answeredButtons = currentAnswers.filter(button => button.disabled);
        const selectedAnswers = answeredButtons.map(button => {
            return {
                text: button.innerText,
                correct: button.dataset.correct,
                selected: button.classList.contains('correct')
            };
        });
        
        answerHistory[currentQuestionIndex] = {
            question: shuffledQuestions[currentQuestionIndex],
            selectedAnswers: selectedAnswers
        };
    }

    function setNextQuestion() {
        resetState();
        showQuestion(shuffledQuestions[currentQuestionIndex]);
        
        // Botão "Anterior" sempre visível e habilitado
        prevButton.classList.remove('hide');
        prevButton.disabled = false;
        prevButton.classList.remove('disabled-btn');
    }
    
    function setPreviousQuestion() {
        resetState();
        showQuestion(shuffledQuestions[currentQuestionIndex]);
        
        // Botão "Anterior" sempre visível e habilitado
        prevButton.disabled = false;
        prevButton.classList.remove('disabled-btn');
    }

    function showQuestion(question) {
        questionElement.innerText = question.question;
        
        // Mostra a imagem correspondente à pergunta atual
        const questionIndex = shuffledQuestions.indexOf(question);
        quizImage.style.backgroundImage = `url(${imageUrls[questionIndex]})`;
        quizImage.style.display = 'block';
        
        question.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('btn');
            // Sempre armazena o valor de "correct", seja true ou false
            button.dataset.correct = answer.correct;
            button.addEventListener('click', selectAnswer);
            // Aplica efeito de clique para cada botão de resposta
            applyClickEffect(button);
            answerButtonsElement.appendChild(button);
        });
    }

    function resetState() {
        clearStatusClass(document.body);
        while (answerButtonsElement.firstChild) {
            answerButtonsElement.removeChild(answerButtonsElement.firstChild);
        }
    }

    function selectAnswer(e) {
        const selectedButton = e.target;
        
        // Verificação mais rigorosa para garantir que boolean-string "false" não seja tratado como true
        const isCorrect = selectedButton.dataset.correct === "true";
        console.log("Resposta selecionada, correct =", isCorrect, selectedButton.dataset.correct);
        
        // Aplica efeito visual de clique mais pronunciado
        selectedButton.classList.add('btn-click-effect');
        // Reproduz o som de clique diretamente
        playClickSound();
        
        // Aguarda o efeito visual terminar antes de mostrar a resposta
        setTimeout(() => {
            selectedButton.classList.remove('btn-click-effect');
            
            // Verifica se a resposta tem uma mensagem específica
            const currentQuestion = shuffledQuestions[currentQuestionIndex];
            const selectedAnswerIndex = Array.from(answerButtonsElement.children).indexOf(selectedButton);
            const selectedAnswer = currentQuestion.answers[selectedAnswerIndex];
            
            // Se a resposta for incorreta e tiver uma mensagem personalizada, mostra-a
            if (!isCorrect && selectedAnswer && selectedAnswer.message) {
                // Cria um elemento para mostrar a mensagem
                const messageElement = document.createElement('div');
                messageElement.textContent = selectedAnswer.message;
                messageElement.classList.add('error-message');
                
                // Estilo para o elemento de mensagem flutuante
                messageElement.style.position = 'fixed';
                messageElement.style.top = '50%';
                messageElement.style.left = '50%';
                messageElement.style.transform = 'translate(-50%, -50%) scale(0.8)';
                messageElement.style.padding = '15px 30px';
                messageElement.style.borderRadius = '10px';
                messageElement.style.backgroundColor = 'rgba(244, 67, 54, 0.9)';
                messageElement.style.color = 'white';
                messageElement.style.fontWeight = 'bold';
                messageElement.style.fontSize = '1.4rem';
                messageElement.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
                messageElement.style.zIndex = '1000';
                messageElement.style.textAlign = 'center';
                messageElement.style.minWidth = '250px';
                messageElement.style.transition = 'all 0.3s ease-in-out';
                messageElement.style.opacity = '0';
                
                // Adiciona a mensagem ao corpo do documento
                document.body.appendChild(messageElement);
                
                // Anima a entrada da mensagem - efeito de expansão e fade-in
                setTimeout(() => {
                    messageElement.style.opacity = '1';
                    messageElement.style.transform = 'translate(-50%, -50%) scale(1)';
                }, 10);
                
                // Remove a mensagem após alguns segundos com animação de fade-out
                setTimeout(() => {
                    messageElement.style.opacity = '0';
                    messageElement.style.transform = 'translate(-50%, -50%) scale(0.8)';
                    setTimeout(() => {
                        if (messageElement.parentNode) {
                            messageElement.parentNode.removeChild(messageElement);
                        }
                    }, 300); // Tempo para a animação completar
                }, 2000);
            }
            
            // Continua o processamento da resposta, mas só mostra a resposta correta se acertar
            if (isCorrect) {
                setStatusClass(document.body, isCorrect);
                Array.from(answerButtonsElement.children).forEach(button => {
                    if (button.dataset.correct === "true") {
                        setStatusClass(button, true);
                    }
                    button.disabled = true;
                });
            } else {
                // Se errou, apenas marca a resposta errada
                setStatusClass(selectedButton, false);
                selectedButton.disabled = true;
                
                // Retorna aqui para não executar o código abaixo se a resposta for incorreta
                return;
            }
            
            // Salva a resposta atual no histórico
            saveCurrentAnswerState();
            
            // Cria um temporizador para avançar automaticamente após 2000ms, mas APENAS se a resposta for correta
            if (isCorrect && shuffledQuestions.length > currentQuestionIndex + 1) {
                setTimeout(() => {
                    currentQuestionIndex++;
                    setNextQuestion();
                }, 2000); // Aumento o tempo para dar tempo de ler a mensagem
            } else if (isCorrect && currentQuestionIndex === shuffledQuestions.length - 1) {
                // Última pergunta e resposta correta - mostra a mensagem final
                setTimeout(() => {
                    quizContainer.classList.add('hide');
                    messageContainer.classList.remove('hide');
                    
                    // Remove qualquer imagem final anterior para evitar duplicação
                    const existingFinalImages = messageContainer.querySelectorAll('.quiz-image');
                    existingFinalImages.forEach(img => {
                        messageContainer.removeChild(img);
                    });
                    
                    // Adiciona a imagem final na tela de mensagem
                    const finalImageElement = document.createElement('div');
                    finalImageElement.classList.add('quiz-image');
                    finalImageElement.style.backgroundImage = `url(${finalImage})`;
                    finalImageElement.style.margin = '20px auto';
                    // Adicionando cursor pointer e estilos para indicar que é clicável
                    finalImageElement.style.cursor = 'pointer';
                    // Adicionando borda pulsante para indicar que é clicável
                    finalImageElement.style.animation = 'pulse 2s infinite';
                    // Adicionando evento de clique para redirecionar ao vale presente
                    finalImageElement.addEventListener('click', function() {
                        // Redirecionando para a página do vale presente
                        window.location.href = 'vale-presente.html';
                        // Reproduz o som de clique
                        playClickSound();
                    });
                    // Adicionando título/dica embaixo da imagem
                    const clickHint = document.createElement('p');
                    clickHint.textContent = 'Clique na imagem para uma surpresa especial! 💝';
                    clickHint.style.textAlign = 'center';
                    clickHint.style.color = 'var(--theme-tertiary)';
                    clickHint.style.fontStyle = 'italic';
                    clickHint.style.marginTop = '10px';
                    // Pulse animation para chamar atenção
                    clickHint.style.animation = 'pulse 1.5s infinite';
                    
                    messageContainer.insertBefore(finalImageElement, messageContainer.querySelector('.heart-container'));
                    messageContainer.insertBefore(clickHint, messageContainer.querySelector('.heart-container'));
                    
                    // Oculta os corações animados
                    const heartContainer = messageContainer.querySelector('.heart-container');
                    if (heartContainer) {
                        heartContainer.style.display = 'none';
                    }
                    
                    // Modifica o botão de recomeçar para ser um ícone de casa
                    restartButton.innerHTML = '🏠';
                    restartButton.classList.add('home-btn');
                    restartButton.style.borderRadius = '50%';
                    restartButton.style.width = '50px';
                    restartButton.style.height = '50px';
                    restartButton.style.padding = '0';
                    restartButton.style.display = 'flex';
                    restartButton.style.justifyContent = 'center';
                    restartButton.style.alignItems = 'center';
                    restartButton.style.lineHeight = '1';
                    restartButton.style.fontSize = '22px';
                    restartButton.style.boxShadow = 'none';
                    restartButton.style.margin = '20px auto';
                    restartButton.style.backgroundColor = 'var(--theme-primary)';
                    restartButton.style.color = 'white';
                    restartButton.style.border = 'none';
                    restartButton.style.outline = 'none';
                    
                    // Remove todos os event listeners existentes
                    const oldBtn = restartButton;
                    const newBtn = oldBtn.cloneNode(true);
                    oldBtn.parentNode.replaceChild(newBtn, oldBtn);
                    
                    // Adiciona um evento de clique direto que não usa href ou navegação
                    newBtn.onclick = function() {
                        // Oculta a mensagem final
                        messageContainer.classList.add('hide');
                        // Oculta o container de perguntas também
                        questionContainerElement.classList.add('hide');
                        // Mostra o botão de início
                        startButton.classList.remove('hide');
                        // Mostra o quiz container (que contém o título)
                        quizContainer.classList.remove('hide');
                        // Redefine a imagem para a foto inicial
                        quizImage.style.backgroundImage = `url(${initialImage})`;
                        // Oculta o botão de voltar na página inicial
                        prevButton.classList.add('hide');
                        
                        // Mostra novamente o título e o nome do destinatário
                        document.querySelector('.title').style.display = 'block';
                        document.querySelector('.recipient').style.display = 'block';
                        
                        // Limpa o histórico
                        answerHistory = [];
                        // Reseta o estado para garantir limpeza completa
                        resetState();
                        // Reproduz o som de clique
                        playClickSound();
                    };
                }, 2000);
            }
        }, 300);
    }

    function setStatusClass(element, correct) {
        clearStatusClass(element);
        // Garantir que o parâmetro correct é interpretado corretamente
        if (correct === true || correct === "true") {
            element.classList.add('correct');
        } else {
            element.classList.add('wrong');
        }
    }

    function clearStatusClass(element) {
        element.classList.remove('correct');
        element.classList.remove('wrong');
    }

    // Função para verificar se há bolhas suficientes e adicionar mais se necessário
    function checkAndAddBubbles() {
        const bubbleCount = bubblesContainer.querySelectorAll('.bubble').length;
        
        // Se tivermos menos de 30 bolhas visíveis, criar mais
        if (bubbleCount < 30) {
            for (let i = 0; i < 40; i++) {
                setTimeout(() => {
                    createBubble();
                }, i * 30);
            }
        }
    }

    // Perguntas e respostas do quiz
    const questions = [
        {
            question: 'Qual é minha coisa favorita em você?',
            answers: [
                { text: 'Seu sorriso', correct: false, message: 'gosto muito' },
                { text: 'Sua inteligência', correct: false, message: 'te amo meu macaquinho' },
                { text: 'Sua gentileza', correct: false, message: 'gentil comigo nunca' },
                { text: 'Tudo em você', correct: true }
            ]
        },
        {
            question: 'Quando percebi que estava apaixonado por você?',
            answers: [
                { text: 'No primeiro encontro', correct: false, message: 'tambem' },
                { text: 'Quando te vi pela primeira vez', correct: true },
                { text: 'Quando conversamos pela primeira vez', correct: false, message: 'voce nem sabia quem era eu' },
                { text: 'Desde o primeiro momento', correct: false, message: 'só queria dar' }
            ]
        },
        {
            question: 'O que mais gosto de fazer com você?',
            answers: [
                { text: 'Assistir filmes', correct: false, message: 'Dá pra melhorar' },
                { text: 'Conversar por horas', correct: false, message: 'Você fala muito' },
                { text: 'Passear de mãos dadas', correct: false, message: 'Para de ser gay' },
                { text: 'Simplesmente estar ao seu lado', correct: true }
            ]
        },
        {
            question: 'Quanto eu te amo?',
            answers: [
                { text: 'Mais que tudo', correct: true },
                { text: 'Além das estrelas', correct: true },
                { text: 'Infinitamente', correct: true },
                { text: 'Mais a cada dia', correct: true }
            ]
        },
        {
            question: 'O que você significa para mim?',
            answers: [
                { text: 'Meu mundo inteiro', correct: true },
                { text: 'Minha pessoa favorita', correct: true },
                { text: 'Meu amor verdadeiro', correct: true },
                { text: 'Minha melhor amiga e amor da minha vida', correct: true }
            ]
        }
    ];
    
    // Definir o tema claro por padrão
    document.documentElement.classList.add('light-theme');
}); 