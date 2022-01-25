import Image from 'next/image';
import styles from '../styles/components/Post.module.scss';

import { BsHandThumbsUpFill, BsHandThumbsUp } from 'react-icons/bs';
import { HiDotsHorizontal } from 'react-icons/hi';
import { FaCommentDots } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import Moment from 'react-moment';
import axios from 'axios';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import Comment from './Comment';

interface Props {
  _id?: string;
  username?: string;
  caption?: string;

  postImgs?: [string];
  likes?: [string];
  comments?: [];
  createdAt?: string;
}

const Post = ({
  _id,
  postImgs,
  createdAt,
  username,
  caption,
  likes,
}: Props) => {
  const [post, setPost] = useState({
    _id,
    postImgs,
    createdAt,
    username,
    userImg: '',
    caption,
    likes,
  });

  const [showOptions, setShowOption] = useState<boolean>(false);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(Number(likes?.length));
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState(post.caption);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [comments, setComments] = useState<any>();
  const [isCmtOpen, setIsCmtOpen] = useState<boolean>(false);

  const UserData = useSelector((state: any) => state?.user?.user);

  useEffect(() => {
    const getUserImg = async () => {
      const token = UserData?.token;
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${username}`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      setPost({ ...post, userImg: data?.profilePic });
    };
    getUserImg();
  }, []);

  const handleLike = async () => {
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${post._id}/like`,
        '',
        { headers: { authorization: `Bearer ${UserData?.token}` } }
      );
      if (data === 'Liked') {
        setHasLiked(true);
        return setLikesCount(likesCount + 1);
      } else {
        setHasLiked(false);
        return setLikesCount(likesCount - 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const username = UserData?.username;
    if (likes?.includes(username)) {
      setHasLiked(true);
    } else {
      setHasLiked(false);
    }
  }, [likes, UserData]);

  useEffect(() => {
    const getComments = async () => {
      const token = UserData?.token;
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${post._id}/comments`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      setComments(data);
    };
    getComments();
  }, [UserData, post]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/posts/${_id}`, {
        headers: { authorization: `Bearer ${UserData?.token}` },
      });
      setIsDeleted(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async () => {
    try {
      const { data } = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${_id}`,
        { caption: editValue },
        { headers: { authorization: `Bearer ${UserData?.token}` } }
      );
      setPost(data);

      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isDeleted ? (
        ''
      ) : (
        <div className={styles.post}>
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
          <div className={styles.user}>
            <Link
              href={
                UserData?.username === post.username
                  ? '/profile'
                  : `/profile/${post.username}`
              }
              passHref
            >
              <figure className={styles.userImg}>
                <Image
                  src={post.userImg || '/images/account.png'}
                  alt="user"
                  layout="fill"
                  objectFit="cover"
                  className={styles.userImage}
                />
              </figure>
            </Link>

            <div className={styles.userInfo}>
              <Link
                href={
                  UserData?.username === post.username
                    ? '/profile'
                    : `/profile/${post.username}`
                }
                passHref
              >
                <h5>{post.username}</h5>
              </Link>
              <p>
                <Moment fromNow>{createdAt}</Moment>
              </p>
            </div>
            {UserData?.username === username && (
              <HiDotsHorizontal
                onClick={() => setShowOption(!showOptions)}
                style={{ fontSize: '1.5rem', cursor: 'pointer' }}
                className={styles.optionsIcon}
              />
            )}
          </div>
          {isEditing ? (
            <input
              className={styles.captionEdit}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
          ) : (
            <p className={styles.caption}>{post.caption}</p>
          )}
          {postImgs?.length ? (
            <>
              {postImgs.map((post) => {
                return (
                  <figure key={post} className={styles.postImg}>
                    <Image
                      src={post}
                      layout="fill"
                      objectFit="contain"
                      alt=""
                    />
                  </figure>
                );
              })}
            </>
          ) : (
            ''
          )}
          <div className={styles.interact}>
            <div>
              {hasLiked ? (
                <BsHandThumbsUpFill onClick={handleLike} />
              ) : (
                <BsHandThumbsUp onClick={handleLike} />
              )}
              <p>{likesCount}</p>
            </div>
            <div onClick={() => setIsCmtOpen(!isCmtOpen)}>
              <FaCommentDots />
              <p>{comments?.length}</p>
            </div>
          </div>
          {isCmtOpen && <Comment comments={comments} postID={post._id} />}
        </div>
      )}
    </>
  );
};

export default Post;
