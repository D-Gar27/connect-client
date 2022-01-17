import styles from '../styles/components/Feed.module.scss';
import Post from './Post';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import UploadArea from './UploadArea';
import { useSelector } from 'react-redux';

type Posts =
  | [
      {
        username?: string;
        caption?: string;
        userImg?: string;
        postImgs?: [string];
        likes?: [string];
        comments?: [];
        createdAt?: string;
      }
    ]
  | [];

const Loading = [1, 2, 3];

const Feed = () => {
  const [posts, setPosts] = useState<Posts | []>();
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{ success: boolean; msg: string }>({
    success: false,
    msg: '',
  });
  const UserData = useSelector((state: any) => state?.user?.user);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const token = UserData.token;
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/feed`, {
          headers: { authorization: `Bearer ${token}` },
        });
        const postsArr: [] = await res.data;
        if (!postsArr.length) {
          setLoading(false);
          return setPosts([]);
        }
        setPosts(postsArr);
        setLoading(false);
        setStatus({ success: true, msg: 'success' });
      } catch (error) {
        setLoading(false);
        setStatus({ success: false, msg: 'failed' });
      }
    };
    fetchPosts();
  }, [UserData]);

  return (
    <section className={styles.feedSection}>
      <div className={styles.feedContainer}>
        <div className={styles.uploadAreaDiv}>
          <UploadArea />
        </div>
        {!loading &&
          posts?.map((post: any) => {
            return (
              <Post
                key={post._id}
                postImgs={post.postImgs}
                username={post.username}
                caption={post.caption}
                likes={post.likes}
                comments={post.comments}
                createdAt={post.createdAt}
                _id={post._id}
              />
            );
          })}
        {loading &&
          Loading.map((num) => (
            <div key={num} className={styles.loading}></div>
          ))}
      </div>
    </section>
  );
};

export default Feed;
