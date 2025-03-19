<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ministry of Finance Chatbot</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="chatbot.css">
    <style>
        body {
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 20px;
            background: #f8fafc;
            color: #1e293b;
            font-weight: 300;
        }

        h1 {
            font-family: 'Poppins', sans-serif;
            font-weight: 300;
            color: #1e293b;
            margin-bottom: 1rem;
            letter-spacing: -0.5px;
        }

        p {
            color: #64748b;
            line-height: 1.6;
            font-weight: 300;
        }

        .chatbot-trigger {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background-color: #007bff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
        }

        .chatbot-trigger i {
            color: white;
            font-size: 24px;
        }

        .chatbot-container {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            display: none;
            flex-direction: column;
            z-index: 1000;
        }

        .chatbot-header {
            padding: 15px;
            background: #007bff;
            color: white;
            border-radius: 10px 10px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .chatbot-title {
            display: flex;
            align-items: center;
             gap: 10px;
        }

        .chatbot-logo {
            width: 30px;
            height: 30px;
            background-color: white;
            padding: 5px;
            border-radius: 50%;
        }

        .chatbot-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 20px;
        }

        .chatbot-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
        }

        .chatbot-input {
            padding: 15px;
            border-top: 1px solid #eee;
            display: flex;
            gap: 10px;
        }

        #chatbot-input-field {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }

        #chatbot-send {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
        }

        #chatbot-send:hover {
            background: #0056b3;
        }
    </style>
</head>
<body>
    <h1>Welcome to Ministry of Finance</h1>
    <p>Click the chat button in the bottom right corner to interact with our AI chatbot assistant.</p>

    <?php include 'chatbot.php'; ?>

    <script>
        let responses = null;

        // Fetch responses.json when the page loads
        fetch('responses.json')
            .then(response => response.json())
            .then(data => {
                responses = data;
            })
            .catch(error => console.error('Error loading responses:', error));

        document.addEventListener('DOMContentLoaded', function() {
            const trigger = document.getElementById('chatbot-trigger');
            const container = document.getElementById('chatbot-container');
            const closeBtn = document.getElementById('chatbot-close');
            const inputField = document.getElementById('chatbot-input-field');
            const sendBtn = document.getElementById('chatbot-send');
            const messagesContainer = document.getElementById('chatbot-messages');

            trigger.addEventListener('click', () => {
                container.style.display = 'flex';
                // Add active class for animation
                setTimeout(() => container.classList.add('active'), 10);
                // Add initial greeting message when chat is opened
                if (messagesContainer.children.length === 0) {
                    // Get a random greeting from responses.json
                    const greetingResponses = responses?.responses?.greeting || [];
                    const randomGreeting = greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
                    addMessage(randomGreeting, false);
                }
            });

            closeBtn.addEventListener('click', () => {
                container.classList.remove('active');
                setTimeout(() => container.style.display = 'none', 300);
            });

            function addMessage(message, isUser = false) {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
                messageDiv.innerHTML = message;
                document.getElementById('chatbot-messages').appendChild(messageDiv);
                document.getElementById('chatbot-messages').scrollTop = document.getElementById('chatbot-messages').scrollHeight;
            }

            function findResponse(message) {
                if (!responses) return getRandomResponse('default');
                
                message = message.toLowerCase().trim();
                
                // Create a function to get all possible matches with their lengths
                function getAllMatches(message, keywords) {
                    const matches = [];
                    keywords.forEach(keyword => {
                        // Convert keyword to lowercase for comparison
                        const lowercaseKeyword = keyword.toLowerCase();
                        if (message.includes(lowercaseKeyword)) {
                            matches.push({
                                keyword: keyword,
                                length: lowercaseKeyword.split(' ').length // Count words in keyword
                            });
                        }
                    });
                    return matches;
                }

                // Function to get the best match (longest matching phrase)
                function getBestMatch(matches) {
                    if (matches.length === 0) return null;
                    // Sort by length (number of words) in descending order
                    return matches.sort((a, b) => b.length - a.length)[0].keyword;
                }

                // 1. First check specific current affairs (most specific queries)
                if (responses.keywords.specific_current_affairs) {
                    for (const [key, keywords] of Object.entries(responses.keywords.specific_current_affairs)) {
                        const matches = getAllMatches(message, keywords);
                        const bestMatch = getBestMatch(matches);
                        if (bestMatch) {
                            return responses.responses.specific_current_affairs[key];
                        }
                    }
                }

                // 2. Check year-specific budget queries
                if (responses.keywords.year_budget) {
                    const matches = getAllMatches(message, Object.keys(responses.responses.year_budget));
                    const bestMatch = getBestMatch(matches);
                    if (bestMatch) {
                        return responses.responses.year_budget[bestMatch];
                    }
                }

                // 3. Check specific policies
                if (responses.keywords.specific_policies) {
                    for (const [key, keywords] of Object.entries(responses.keywords.specific_policies)) {
                        const matches = getAllMatches(message, keywords);
                        const bestMatch = getBestMatch(matches);
                        if (bestMatch) {
                            return responses.responses.specific_policies[key];
                        }
                    }
                }

                // 4. Check specific FAQs
                if (responses.keywords.specific_faqs) {
                    for (const [key, keywords] of Object.entries(responses.keywords.specific_faqs)) {
                        const matches = getAllMatches(message, keywords);
                        const bestMatch = getBestMatch(matches);
                        if (bestMatch) {
                            return responses.responses.specific_faqs[key];
                        }
                    }
                }

                // 5. Check ministry of finance topics
                if (responses.keywords.ministry_of_finance) {
                    for (const [key, keywords] of Object.entries(responses.keywords.ministry_of_finance)) {
                        const matches = getAllMatches(message, keywords);
                        const bestMatch = getBestMatch(matches);
                        if (bestMatch) {
                            const response = responses.responses.ministry_of_finance[key];
                            return Array.isArray(response) ? response[Math.floor(Math.random() * response.length)] : response;
                        }
                    }
                }

                // 6. Check general categories (least specific)
                const generalCategories = ['greeting', 'budget', 'tax', 'services', 'contact', 'documents', 'policies', 'faq', 'current_affairs'];
                for (const category of generalCategories) {
                    if (responses.keywords[category]) {
                        const matches = getAllMatches(message, responses.keywords[category]);
                        const bestMatch = getBestMatch(matches);
                        if (bestMatch) {
                            return getRandomResponse(category);
                        }
                    }
                }

                // If no matches found, return default response
                return getRandomResponse('default');
            }

            function getRandomResponse(category) {
                if (!responses || !responses.responses[category]) return "I apologize, but I'm having trouble processing your request.";
                const responsesList = responses.responses[category];
                return responsesList[Math.floor(Math.random() * responsesList.length)];
            }

            sendBtn.addEventListener('click', () => {
                const message = inputField.value.trim();
                if (message) {
                    addMessage(message, true);
                    inputField.value = '';
                    
                    // Get and display the response
                    setTimeout(() => {
                        const response = findResponse(message);
                        addMessage(response);
                    }, 500);
                }
            });

            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendBtn.click();
                }
            });
        });
    </script>
</body>
</html>