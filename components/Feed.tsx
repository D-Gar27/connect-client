import styles from '../styles/components/Feed.module.scss';
import Post from './Post';
import { useEffect, useState } from 'react';
import axios from 'axios';
import UploadArea from './UploadArea';
import { useSelector } from 'react-redux';
import Suggestions from './Suggestions';

type Posts =
  | [
      {
        _id: string;
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
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/feed`, {
          headers: { authorization: `Bearer ${UserData.token}` },
        });
        const postsArr: [] = await res.data;
        if (postsArr.length === 0) {
          setLoading(false);
          return setPosts([]);
        } else {
          setPosts(postsArr);
          setLoading(false);
          setStatus({ success: true, msg: 'success' });
        }
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
        {!loading && (
          <>
            {posts?.length === 0 && (
              <>
                <div className={styles.suggestion}>
                  <Suggestions />
                </div>
                <h3 className={styles.connect}>o</h3>
              </>
            )}
            {posts?.length !== 0 &&
              posts?.map((post) => (
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
              ))}
          </>
        )}
        {loading &&
          Loading.map((num) => (
            <div key={num} className={styles.loading}></div>
          ))}
      </div>
    </section>
  );
};

export default Feed;
