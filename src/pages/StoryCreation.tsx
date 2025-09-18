import React, { useState, useRef, useEffect } from 'react';
import { Mic, ArrowRight, Pause, User, Send, Image as ImageIcon } from 'lucide-react';
import { truncate } from 'fs';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const StoryCreation = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your Story Creation Tutor! 📚 Would you like to create a brand new story together, or explore "The Mysterious Geyser" story you see here?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [currentStoryText, setCurrentStoryText] = useState(`The children watched as a geyser hot a stream of water into the air. 
    Nearby, a bear stood tall on its hind legs, 
    looking at the geyser with them.`);
  const [currentImage, setCurrentImage] = useState('');
  const [storyTitle, setStoryTitle] = useState('The Mysterious Geyser');
  const [tutorName, setTutorName] = useState('Krafty');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Get API key from environment variable
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    sendMessage(answer);
  };

  const handleMicClick = () => {
    setIsRecording(!isRecording);
    // TODO: Implement speech-to-text functionality
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !apiKey) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Check if user is providing story content (not just questions or chat)
    const isStoryContent = content.length > 50 && (
      content.toLowerCase().includes('story') ||
      content.toLowerCase().includes('once upon') ||
      content.toLowerCase().includes('there was') ||
      content.toLowerCase().includes('chapter') ||
      /[.!?].*[.!?]/.test(content) // Contains multiple sentences
    );

    // Check if user is providing a title
    const titleMatch = content.match(/title[:\s]+"([^"]+)"/i) || 
                      content.match(/called[:\s]+"([^"]+)"/i) ||
                      content.match(/story[:\s]+"([^"]+)"/i);
    
    if (titleMatch && titleMatch[1]) {
      setStoryTitle(titleMatch[1]);
    }

    // Check if user is giving the character/tutor a name
    const nameMatch = content.match(/name[:\s]+(?:is|you|are)[:\s]*([A-Z][a-z]+)/i) ||
                     content.match(/call[:\s]+(?:you|me|him|her)[:\s]*([A-Z][a-z]+)/i) ||
                     content.match(/(?:i'm|my name is)[:\s]*([A-Z][a-z]+)/i);
    
    if (nameMatch && nameMatch[1] && nameMatch[1].length > 2) {
      setTutorName(nameMatch[1]);
    }

    // Update story text only when user provides actual story content
    if (isStoryContent) {
      setCurrentStoryText(content.trim());
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'chatgpt-4o-latest',
          messages: [
            {
                role: 'system',
                content: `
                I am a one-on-one story sidekick for U.S. kids (5–11). I speak in first person and sound like a real friend—simple, warm, playful. My job: joyful, child-led storytelling at a calm, slow pace.
                
                HARD LIMITS (every reply)
                - Two lines max. 30 words total. Exactly one question.
                - Line 1: tiny reaction + short beat about the same topic (≤2 sentences, optional 1 emoji).
                - Line 2: one clear question. Offer one either/or with “ / ” only if child seems stuck.
                - Never say “Surprise me.” No lists, templates, or teacher voice.
                
                SOUND HUMAN, NOT AI
                - Everyday words and contractions. Vary openings. No “Would you like…”, “As an AI…”, “Let’s build…”, “I can help…”.
                - Use child’s name and the sidekick name they gave me.
                - React → mirror 1–3 of the child’s key words in quotes → ask.
                
                DOUBLE-CLICK RULE (cohesion)
                - Always follow up on the child’s last message only.
                - Choose one focus axis per turn: detail (which/what), feeling (how), reason (why), action (what next), memory (who/when), senses (look/sound/smell/touch/taste)—but keep language plain.
                - Next turn must reflect their answer before moving on.
                
                DAILY START (before story)
                - First message is about them (what they liked/made/played/read/did).
                - Reflect briefly, collect up to three interests, then ask for today’s vibe (cozy mystery / wild adventure / silly quest).
                
                ONBOARDING (short turns)
                - Ask the child to name me; confirm and use it.
                - Offer two fun traits for me; the child can add more anytime.
                - Ask for home base (treehouse / city block / meadow / their idea).
                - Ask for main character (animal, kid hero, creature) and one simple goal.
                
                SLOW STORYCRAFT (default)
                - First 6–8 turns: build character and place; no big quests unless the child asks.
                - One new fact per turn. No quick jumps.
                - Each turn includes two of: small action, simple feeling, clear detail, place texture.
                
                STORY LOOP (after setup)
                - Line 1: one small cause→effect beat; end with a soft hook.
                - Line 2: one concrete question tied to the same thing. If the child gave a choice, reflect it next turn.
                - Every 3–4 turns: mini-recap in ≤10 words before the beat.
                
                ADAPTATION
                - Talkative child → I listen more, nudge lightly (“Then what?”).
                - Shy child → one crisp either/or tied to their words (“stars / hearts?”).
                - Ages 5–7 → shorter words, shorter sentences. Ages 8–11 → slightly richer words. If I use a tricky word, give a quick kid-friendly meaning.
                
                VOICE & CHAT
                - Write for out-loud flow: clear rhythm, short sentences, light interjections. In voice mode I may invite a tiny action (“Want to try a lion roar?”).
                - If I mishear: friendly repair (“Oops, I missed that—say it again your way?”).
                
                CONTINUITY & PERSONALIZATION
                - Remember name, interests, characters, and world rules this session. Keep them consistent unless the child changes them.
                - Celebrate the child’s ideas; never overwrite or correct directly.
                
                SAFETY & MOOD
                - PG, kind, inclusive. No gore, romance, or real-world politics. Keep scary parts mild.
                - Problems resolve with cleverness, kindness, or bravery. Never judge or lecture.
                - Do not end the story unless the child says “The End.”
                
                TONE EXAMPLES (style only; don’t reuse)
                - “Oh wow—‘grandma visited.’ What did you two do?”
                - “Nice, ‘baked cookies.’ What shape did you make first?”
                - “You said ‘monkey Zippy.’ What’s one morning habit he has?”
                
                REMEMBER
                - First person only. Two lines, ≤30 words, one question.
                - React → mirror → ask. Stay on the child’s last point.
                - Only one question per line
                - Keep it plain, friendly, and slow; let the child lead.`
        
                                
                
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: `Story Creation Request: ${content.trim()}

Please help me with this story creation or story understanding request. If I'm asking about creating a new story, guide me through the creative process. If I'm asking about "The Mysterious Geyser" or any existing story, help me understand it better and maybe expand on it creatively.`
            }
          ],
          max_tokens: 200,
          temperature: 0.8
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Auto-generate image every 4-5 user messages (after user has provided some story content)
      const userMessageCount = messages.filter(msg => msg.role === 'user').length + 1; // +1 for current message
      if (userMessageCount >= 4 && userMessageCount % 5 === 0 && !isGeneratingImage) {
        // Auto-generate image if we have story content
        const hasStoryContent = messages.some(msg => 
          msg.role === 'user' && msg.content.length > 30
        );
        if (hasStoryContent) {
          setTimeout(() => generateImage(), 1000); // Small delay to let the conversation flow
        }
      }
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please check your API key and try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    sendMessage(inputMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const generateImage = async () => {
    if (!apiKey || isGeneratingImage) return;

    setIsGeneratingImage(true);

    try {
      // Get the latest user message for context
      const latestUserMessage = messages
        .filter(msg => msg.role === 'user')
        .slice(-1)[0];

      const imagePrompt = latestUserMessage 
        ? `Children's book illustration: ${latestUserMessage.content}. Colorful, friendly, cartoon style, suitable for ages 8-12.`
        : `Children's book illustration: ${currentStoryText}. Colorful, friendly, cartoon style, suitable for ages 8-12.`;

      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: imagePrompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          style: 'vivid'
        })
      });

      if (!response.ok) {
        throw new Error(`Image generation failed: ${response.status}`);
      }

      const data = await response.json();
      const imageUrl = data.data[0].url;
      
      setCurrentImage(imageUrl);

      // Update story text based on latest conversation
      if (latestUserMessage) {
        setCurrentStoryText(latestUserMessage.content);
      }

    } catch (error) {
      console.error('Error generating image:', error);
      // You could add a toast notification here
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
      style={{
        background: 'linear-gradient(135deg, #f1f3f4 0%, #e8eaed 100%)'
      }}
    >

      {/* Hardcover Book Container */}
      <div 
        className="relative w-full"
        style={{
          maxWidth: 'calc(72rem * 1.2)', // 6xl (72rem) * 1.2 = 86.4rem
          aspectRatio: '16/10',
          perspective: '1440px' // 1200px * 1.2
        }}
      >
        {/* Book Cover Shadow */}
        <div 
          className="absolute inset-0 rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, #4a6fa5 0%, #2d4a87 100%)',
            transform: 'rotateX(1deg) rotateY(-0.5deg) translateZ(-10px)',
            zIndex: 0,
            boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            filter: 'blur(1px)'
          }}
        />
        
        {/* Book Cover */}
        <div 
          className="absolute inset-0 rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, #5b7db8 0%, #3d5a9a 100%)',
            transform: 'rotateX(0.5deg) rotateY(-0.25deg)',
            zIndex: 1,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          }}
        />
        
        {/* Book Pages Container */}
        <div 
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: '#ffffff',
            margin: '6px',
            height: 'calc(100% - 12px)',
            boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.06), 0 15px 35px -8px rgba(0, 0, 0, 0.15)',
            zIndex: 2
          }}
        >
          {/* Center Spine */}
          <div 
            className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2"
            style={{ 
              width: '1px',
              background: 'linear-gradient(to bottom, transparent 8%, rgba(0, 0, 0, 0.08) 50%, transparent 92%)',
              zIndex: 10 
            }}
          />
          
          {/* 2-Column Grid Container */}
          <div 
            className="w-full h-full"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr'
            }}
          >
            {/* Left Page - Story Content */}
            <div 
              className="flex flex-col"
              style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden', // Prevent any scrolling on left page
                background: `
                  linear-gradient(135deg, #fefefe 0%, #f9f9f7 100%),
                  url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.15'%3E%3Ccircle cx='5' cy='5' r='0.5'/%3E%3Ccircle cx='20' cy='20' r='0.5'/%3E%3Ccircle cx='35' cy='35' r='0.5'/%3E%3C/g%3E%3C/svg%3E")
                `,
                boxShadow: 'inset 2px 0 4px rgba(0, 0, 0, 0.02)',
                padding: '2rem 1.5rem 2rem 2rem'
              }}
            >
            {/* Story Header */}
            <div className="flex justify-between items-start mb-6">
               <h1 
                 className="font-bold text-gray-900 leading-tight"
                 style={{ 
                   fontFamily: 'system-ui, -apple-system, sans-serif',
                   fontSize: 'calc(1.5rem * 1.5)', // text-2xl * 1.5 = 36px
                 }}
               >
                 {storyTitle}
               </h1>
              <button 
                className="w-8 h-8 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300"
                aria-label="Next page"
              >
                <ArrowRight className="w-4 h-4 text-green-600" />
              </button>
            </div>
            
            {/* Story Image */}
            <div 
              className="w-full rounded-lg mb-6 overflow-hidden border border-gray-200 relative"
              style={{
                aspectRatio: '16/10',
                minHeight: '120px'
              }}
            >
               {currentImage ? (
                 <img
                   src={currentImage}
                   alt="Story illustration"
                   className="w-full h-full object-cover"
                   style={{ 
                     filter: isGeneratingImage ? 'blur(2px) brightness(0.7)' : 'none',
                     transition: 'filter 0.3s ease'
                   }}
                 />
               ) : (
                 <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                   <div className="text-center text-gray-400">
                     <div className="flex flex-col items-center space-y-2">
                       <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                       <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
                       <div className="w-16 h-1 bg-gray-300 rounded-full"></div>
                       <div className="w-6 h-1 bg-gray-300 rounded-full"></div>
                       <p className="text-xs mt-2">Image will appear as story develops</p>
                     </div>
                   </div>
                 </div>
               )}
              {isGeneratingImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <div className="text-white text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm">Generating image...</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Story Text */}
            <div className="flex-1 flex flex-col justify-center" style={{ alignSelf: 'stretch' }}>
              <div 
                className="text-gray-800 leading-relaxed"
                style={{
                  fontSize: 'calc(14px * 1.5)', // 14px * 1.5 = 21px
                  lineHeight: '1.6',
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  width: '95%'
                }}
              >
                {currentStoryText.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < currentStoryText.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            {/* Page Number */}
            <div className="flex justify-center mt-6">
              <span 
                className="text-blue-500 font-medium"
                style={{ fontSize: 'calc(0.875rem * 1.5)' }} // text-sm * 1.5
              >
                2
              </span>
            </div>
            </div>
            
            {/* Right Page - Tutor Chat Interface */}
            <div 
              className="flex flex-col"
              style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden', // Prevent page-level scrolling
                background: `
                  linear-gradient(135deg, #fefefe 0%, #f9f9f7 100%),
                  url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.15'%3E%3Ccircle cx='5' cy='5' r='0.5'/%3E%3Ccircle cx='20' cy='20' r='0.5'/%3E%3Ccircle cx='35' cy='35' r='0.5'/%3E%3C/g%3E%3C/svg%3E")
                `,
                boxShadow: 'inset -2px 0 4px rgba(0, 0, 0, 0.02)',
                padding: '2rem 2rem 2rem 1.5rem'
              }}
            >
            {/* Tutor Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                 <h2 
                   className="font-bold text-gray-900 mb-0.5"
                   style={{ fontSize: 'calc(1.125rem * 1.5)' }} // text-lg * 1.5
                 >
                   {tutorName}
                 </h2>
                <p 
                  className="text-gray-500"
                  style={{ fontSize: 'calc(0.75rem * 1.5)' }} // text-xs * 1.5
                >
                  Monitored by Raj
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full font-medium text-gray-700 transition-colors flex items-center space-x-1.5 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  style={{ fontSize: 'calc(0.75rem * 1.5)' }} // text-xs * 1.5
                >
                  <Pause className="w-3 h-3" />
                  <span>Pause</span>
                </button>
                <button 
                  className="text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus:underline"
                  style={{ fontSize: 'calc(0.75rem * 1.5)' }} // text-xs * 1.5
                >
                  End Session
                </button>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div 
              className="flex-1 overflow-y-auto space-y-3 px-1 py-2" 
              style={{ 
                alignSelf: 'stretch',
                width: '100%',
                minHeight: 0 // Allow flex item to shrink below content size
              }}
            >
              {messages.map((message, index) => (
                <div key={message.id} className={`flex items-start space-x-3 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                    message.role === 'assistant' ? 'bg-blue-500' : 'bg-green-500'
                  }`}>
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div 
                    className={`px-3 py-2.5 rounded-2xl shadow-sm ${
                      message.role === 'assistant' 
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100' 
                        : 'bg-gradient-to-r from-green-50 to-green-100'
                    }`}
                    style={{ maxWidth: '92%' }}
                  >
                    <p 
                      className="text-gray-800"
                      style={{ fontSize: 'calc(0.875rem * 1.5)' }} // text-sm * 1.5
                    >
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div 
                  className="px-3 py-2.5 rounded-2xl shadow-sm bg-gradient-to-r from-blue-50 to-blue-100"
                  style={{ maxWidth: '92%' }}
                >
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Quick Story Starters */}
            {messages.length === 1 && (
              <div className="px-1 mb-3 pb-3 border-b border-gray-100">
                <p 
                  className="text-gray-500 mb-2"
                  style={{ fontSize: 'calc(0.75rem * 1.5)' }} // text-xs * 1.5
                >
                  Quick starters:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Create a new adventure story",
                    "Tell me about the geyser story",
                    "Help me write about animals",
                    "I want to create a mystery"
                  ].map((starter, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(starter)}
                      className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full transition-colors"
                      style={{ fontSize: 'calc(0.75rem * 1.5)' }} // text-xs * 1.5
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Input Bar */}
            <div className="flex items-center space-x-2 pt-3 mt-2 border-t border-gray-100">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={apiKey ? "Type your message..." : "API key not configured..."}
                  disabled={!apiKey || isLoading}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-50 disabled:text-gray-400"
                  style={{ fontSize: 'calc(0.875rem * 1.5)' }} // text-sm * 1.5
                />
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || !apiKey || isLoading}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <Send className="w-4 h-4" />
              </button>
              
              <button 
                onClick={handleMicClick}
                className={`p-2 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 focus:ring-red-300 text-white animate-pulse' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 text-white hover:scale-105'
                }`}
                aria-label={isRecording ? "Stop recording" : "Start voice recording"}
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            {/* Create Image Button */}
            <div className="flex justify-center mt-3">
              <button
                onClick={generateImage}
                disabled={!apiKey || isGeneratingImage}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
              >
                <ImageIcon className="w-4 h-4" />
                <span>
                  {isGeneratingImage ? 'Creating Image...' : 'Create Image'}
                </span>
                {isGeneratingImage && (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                )}
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryCreation;