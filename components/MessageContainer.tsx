import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../styles/pages/Chat.module.scss';
import socketIO from 'socket.io-client';
import { closeMsgbox } from '../redux/chatSlice';

import { FaAngleDoubleLeft } from 'react-icons/fa';

type Messages = {
  chatID: string;
  sender: string;
  receiver?: string;
  _id?: string;
  text: string;
  createdAt: string;
}[];

const MessageContainer = () => {
  // const [isStarted, setIsStarted] = useState<boolean>(false);
  // const [newMsg, setNewMsg] = useState<any>(null);
  // const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<Messages>();
  const [text, setText] = useState('');

  const UserData = useSelector((state: any) => state?.user?.user);
  const Chat = useSelector((state: any) => state?.chat);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/chat/messages/${Chat?.chat?.chatID}`
        );
        setMessages(res.data);
        // setIsStarted(true);
      } catch (error) {
        // setIsStarted(false);
      }
    };
    if (Chat?.chat?.chatID) {
      fetchMessages();
    }
  }, [UserData, Chat]);

  // useEffect((): any => {
  //   const newSocket = socketIO('http://localhost:5000');
  //   setSocket(newSocket);
  //   () => newSocket.close;
  // }, []);

  // useEffect(() => {
  //   if (!socket) {
  //     return;
  //   }
  //   socket.on('receive_msg', (data: any) => setNewMsg(data));
  //   // console.log(newMsg);
  //   return socket.off('receive_msg');
  // }, [socket]);

  const sendMessage = async () => {
    // socket.emit('send_msg', {
    //   sender: UserData?.username,
    //   receiver: Chat?.chat?.userToSend,
    //   text,
    // });
    if (Chat?.chat?.chatID) {
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/chat/messages`,
          {
            sender: UserData?.username,
            receiver: Chat?.chat?.userToSend,
            chatID: Chat?.chat?.chatID,
            text,
          }
        );
        setMessages(messages?.concat([data]));

        setText('');
      } catch (error) {}
    } else return;
  };

  const dispatch = useDispatch();

  return (
    <div className={styles.chatContainer}>
      <section className={styles.messages}>
        {messages?.length ? (
          <>
            {messages.map((message) => (
              <div
                key={message._id}
                className={
                  message?.sender !== UserData?.username
                    ? styles.messageContainer
                    : `${styles.messageContainer} ${styles.messageContainerSender}`
                }
              >
                <figure className={styles.userImg}>
                  <Image
                    src={Chat?.chat?.userPic || '/images/account.svg'}
                    alt=""
                    layout="fill"
                    objectFit="cover"
                    className={styles.img}
                  />
                </figure>
                <div className={styles.textContainer}>
                  <p className={styles.text}>{message.text}</p>
                  <p className={styles.time}>
                    <Moment fromNow>{message.createdAt}</Moment>
                  </p>
                </div>
              </div>
            ))}
          </>
        ) : (
          <h1 className={styles.chatTitle}>
            Let&apos;s start a conversation with {Chat?.chat?.userToSend}
          </h1>
        )}
      </section>
      <div className={styles.sendMsg}>
        <button
          className={styles.backBtn}
          onClick={() => dispatch(closeMsgbox(''))}
        >
          <FaAngleDoubleLeft className={styles.backIcon} />
        </button>
        <div>
          <input
            type="text"
            placeholder="Message to send"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default MessageContainer;
