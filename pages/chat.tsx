import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import MessageContainer from '../components/MessageContainer';
import { closeMsgbox, currentChat, restoreChat } from '../redux/chatSlice';
import styles from '../styles/pages/Chat.module.scss';

type RecentCon = [
  {
    _id: string;
    members: [string];
  }
];

const Chat = () => {
  const [conversations, setConversations] = useState<RecentCon>();

  const UserData = useSelector((state: any) => state?.user?.user);
  const Chat = useSelector((state: any) => state?.chat);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/chat/${UserData?.username}`
        );
        setConversations(res.data);
      } catch (error) {}
    };
    fetchRecent();
  }, [UserData]);

  useEffect(() => {
    const lastChat: any = JSON.parse(
      JSON.stringify(localStorage.getItem('chat'))
    );
    const lastUser = lastChat?.userToSend;
    const lastCon = conversations?.some((con) =>
      con.members.includes(lastUser)
    );
    if (lastChat && lastCon) {
      dispatch(restoreChat(lastChat));
    }
  }, [conversations, dispatch]);

  return (
    <main className={styles.chatRoom}>
      {' '}
      <aside className={styles.users}>
        <div className={styles.usersContainer}>
          {!conversations?.length ? (
            <p>You haven&apos;t talk to anyone yet</p>
          ) : (
            <>
              {' '}
              {conversations?.map((user: any) => (
                <ChatUser key={user?._id} user={user} />
              ))}
            </>
          )}
        </div>
      </aside>
      <section
        className={styles.chatArea}
        style={{ display: Chat?.isOpen ? 'flex' : 'none' }}
      >
        {Chat?.isOpen ? <MessageContainer /> : <h1>Start conversations now</h1>}
      </section>
    </main>
  );
};

export default Chat;

interface UserProps {
  user: {
    _id: string;
    members: string[];
  };
}

interface UserInfo {
  profilePic: string;
  username: string;
}

const ChatUser = ({ user }: UserProps) => {
  const UserData = useSelector((state: any) => state?.user?.user);
  const Chat = useSelector((state: any) => state?.chat);

  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userToFetch = user.members.filter(
        (user) => UserData?.username !== user
      );
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${userToFetch[0]}`,
          { headers: { authorization: `Bearer ${UserData?.token}` } }
        );
        setUserInfo(res.data);
      } catch (error) {}
    };
    if (user) {
      fetchUser();
    }
  }, [UserData, user]);

  useEffect(() => {
    const res = Chat?.onlineUsers?.filter(
      (user: any) => user?.username === userInfo?.username
    );
    if (res) {
      setIsActive(res[0]?.username === userInfo?.username);
    }
  }, [userInfo, Chat]);

  const deleteChat = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/chat/${user._id}`);
      dispatch(closeMsgbox(''));
      setIsDeleted(true);
    } catch (error) {}
  };

  return (
    <div
      style={{
        backgroundColor:
          Chat?.chat?.userToSend === userInfo?.username ? '#31363b' : '',
      }}
      className={
        isDeleted ? `${styles.isDeleted} ${styles.userDiv}` : styles.userDiv
      }
      onClick={() => {
        dispatch(
          currentChat({
            chatID: user._id,
            userPic: userInfo?.profilePic,
            userToSend: userInfo?.username,
          })
        );
        localStorage.setItem(
          'chat',
          JSON.stringify({
            chatID: user._id,
            userPic: userInfo?.profilePic,
            userToSend: userInfo?.username,
          })
        );
      }}
    >
      <div className={styles.user}>
        <figure className={styles.userImg}>
          <Image
            src={userInfo?.profilePic || '/images/account.svg'}
            alt=""
            layout="fill"
            objectFit="cover"
            className={styles.img}
          />
          <div
            className={styles.indicator}
            style={{
              backgroundColor: isActive ? 'springgreen' : 'darkgray',
            }}
          ></div>
        </figure>
        <p>{userInfo?.username}</p>
      </div>
      <FaTrash className={styles.trashIcon} onClick={deleteChat} />
    </div>
  );
};
