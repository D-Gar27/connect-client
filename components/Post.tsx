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

interface Props {
  _id?: string;
  username?: string;
  caption?: string;

  postImgs: [string];
  likes?: [string];
  comments?: [];
  createdAt: string;
}

const Post = ({
  _id,
  postImgs,
  createdAt,
  username,
  caption,
  likes,
  comments,
}: Props) => {
  const [post, setPost] = useState({
    _id,
    postImgs,
    createdAt,
    username,
    userImg: '',
    caption,
    likes,
    comments,
  });

  const [showOptions, setShowOption] = useState<boolean>(false);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(Number(likes?.length));
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState(post.caption);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

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
              <div className={styles.userImg}>
                <Image
                  src={post.userImg || '/images/account.png'}
                  alt="user"
                  layout="fill"
                  objectFit="cover"
                  className={styles.userImage}
                />
              </div>
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
          {/* {postImgs?.length > 0 && <div>
        postImgs.map((img, i) => {
          return (
            <div className={styles.postImg} key={i}>
              <Image
                src={img}
                alt={''}
                layout="fill"
                objectFit="contain"
                className="img"
              />
            </div>
          );
        })
        </div>} */}
          <div className={styles.interact}>
            <div>
              {hasLiked ? (
                <BsHandThumbsUpFill onClick={handleLike} />
              ) : (
                <BsHandThumbsUp onClick={handleLike} />
              )}
              <p>{likesCount}</p>
            </div>
            <div>
              <FaCommentDots />
              <p>{post.comments?.length}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Post;
