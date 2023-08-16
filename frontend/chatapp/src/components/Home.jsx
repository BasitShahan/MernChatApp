import React, { useState, useEffect } from 'react';
import './home.css';
import { io } from 'socket.io-client';
import Message from './message/Message';
import axios from 'axios';

const socket = io('http://localhost:4000');

export default function Home() {
  const [name, setName] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [state, setState] = useState([]);
  const [showPrevious, setShowPrevious] = useState(false);

  useEffect(() => {
    const promptName = () => {
      const userName = prompt('Enter your name to join');

      if (userName) {
        setName(userName);
        socket.emit('new-user-joined', userName);
      }
    };

    promptName();

    socket.on('user-joined', (name) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `${name} joined the chat`, sender: 'system' },
      ]);
    });

    socket.on('receive', (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `${data.name}: ${data.message}`, sender: 'other' },
      ]);
    });

    // Fetch data from /getdata API and update the state
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/getdata');
        if (response.data) {
          setState(response.data);
          setShowPrevious(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    return () => {
      socket.off('user-joined');
      socket.off('receive');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();

    const trimmedMessage = messageInput.trim();
    if (trimmedMessage) {
      socket.emit('send', trimmedMessage);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: trimmedMessage, sender: 'self' },
      ]);
      setMessageInput('');
    }
  };

  return (
    <div>
      <Message />
      <div className="container">
        <div className="col-12 col-lg-4 col-md-4">
          <div className="contain">
            {showPrevious &&
              state.map((data, index) => (
                <div key={index} className="message left">
                  {data.messages}
                </div>
              ))}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.sender === 'self' ? 'right' : 'left'}`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="send">
            <form onSubmit={sendMessage} id="sendcontainer">
              <input
                type="text"
                name="message"
                id="messageinp"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button type="submit" id="btn">
                send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
