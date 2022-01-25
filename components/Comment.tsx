import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { HiDotsHorizontal } from 'react-icons/hi';
import Moment from 'react-moment';
import { useSelector } from 'react-redux';
import styles from '../styles/components/Comment.module.scss';

interface Comments {
  comments:
    | {
        _id: string;
        comment: string;
        username: string;
        postId: string;
        createdAt: string;
      }[]
    | any;
  postID: string | any;
}

interface Comment {
  comment: string;
  username: string;
  postId: string;
  createdAt: string;
  _id: string;
}

const Comment = ({ comments, postID }: Comments) => {
  const [commentText, setCommentText] = useState<string>('');
  const UserData = useSelector((state: any) => state?.user?.user);

  const addCommentsHandler = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${postID}/addComment`,
        { username: UserData?.username, comment: commentText, postId: postID },
        {
          headers: { authorization: `Bearer ${UserData.token}` },
        }
      );
      comments.push(res.data);
      setCommentText('');
    } catch (error) {}
  };

  return (
    <section className={styles.comment}>
      <section>
        {comments?.map((cmt: Comment) => (
          <CommentDiv key={cmt._id} cmt={cmt} />
        ))}
      </section>
      <form className={styles.input}>
        <input
          type="text"
          placeholder="Add your comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button onClick={addCommentsHandler}>Send</button>
      </form>
    </section>
  );
};

export default Comment;

interface CommentProps {
  cmt: {
    comment: string;
    username: string;
    postId: string;
    createdAt: string;
    _id: string;
  };
}

const CommentDiv = ({ cmt: comment }: CommentProps) => {
  const UserData = useSelector((state: any) => state?.user?.user);
  const [userImg, setUserImg] = useState<string>('');
  const [cmt, setCmt] = useState(comment);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [editValue, setEditValue] = useState(cmt?.comment);

  useEffect(() => {
    const getUserImg = async () => {
      const token = UserData?.token;
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${cmt?.username}`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      setUserImg(data.profilePic);
    };
    getUserImg();
  }, [UserData, cmt]);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${cmt?._id}`,
        {
          headers: { authorization: `Bearer ${UserData?.token}` },
        }
      );
      setShowOptions(false);
      setIsDeleted(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async () => {
    try {
      const { data } = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${cmt?._id}`,
        { comment: editValue },
        {
          headers: { authorization: `Bearer ${UserData.token}` },
        }
      );
      setCmt(data);

      setIsEditing(false);
      setShowOptions(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={styles.commentDiv}
      style={{ display: isDeleted ? 'none' : 'flex' }}
    >
      {showOptions && (
        <ul className={styles.options}>
          {isEditing ? (
            <li onClick={() => setIsEditing(false)}>Cancle</li>
          ) : (
            <li onClick={() => setIsEditing(true)}>Edit</li>
          )}
          {isEditing && <li onClick={() => handleEdit()}>Finish</li>}
          <li className={styles.delete} onClick={() => handleDelete()}>
            Delete
          </li>
        </ul>
      )}
      <div className={styles.top}>
        <Link
          href={
            UserData?.username === cmt?.username
              ? '/profile'
              : `/profile/${cmt?.username}`
          }
          passHref
        >
          <div className={styles.userInfo}>
            <figure className={styles.userImg}>
              <Image
                src={userImg || '/images/account.png'}
                alt="user"
                layout="fill"
                objectFit="cover"
                className={styles.userImage}
              />
            </figure>
            <p>{cmt?.username}</p>
          </div>
        </Link>
        {UserData?.username === cmt?.username && (
          <HiDotsHorizontal
            onClick={() => setShowOptions(!showOptions)}
            style={{ fontSize: '1.5rem', cursor: 'pointer' }}
            className={styles.optionsIcon}
          />
        )}
      </div>
      <div className={styles.bottom}>
        {isEditing ? (
          <input
            className={styles.commentEdit}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
        ) : (
          <p className={styles.commentText}>{cmt?.comment}</p>
        )}
        <time className={styles.moment}>
          <Moment fromNow>{cmt?.createdAt}</Moment>
        </time>
      </div>
    </div>
  );
};
