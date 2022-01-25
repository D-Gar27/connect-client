import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Post from '../../components/Post';
import { currentChat } from '../../redux/chatSlice';
import styles from '../../styles/pages/Profile.module.scss';

interface Userdata {
  bio: string;
  caption: string;
  createdAt: string;
  email: string;
  followers: [string];
  following: [string];
  isAdmin: boolean;
  profilePic: string;
  username: string;
}

const Profile = () => {
  const [userData, setUserData] = useState<Userdata>();
  const [userPosts, setUserPosts] = useState<
    {
      _id?: string;
      username?: string;
      caption?: string;
      userImg?: string;
      postImgs: [string];
      likes?: [string];
      comments?: [];
      createdAt: string;
    }[]
  >();
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{ success: boolean; msg: string }>({
    success: false,
    msg: '',
  });

  const [followers, setFollowers] = useState<{ pic: string; name: string }[]>();
  const [following, setFollowing] = useState<{ pic: string; name: string }[]>();

  const router = useRouter();
  const dispatch = useDispatch();
  const username = router.query.username;

  const UserData = useSelector((state: any) => state?.user?.user);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${username}/posts`,
          {
            headers: {
              authorization: `Bearer ${UserData?.token}`,
            },
          }
        );
        setUserPosts(data);
        setLoading(false);
        setStatus({ success: true, msg: 'success' });
      } catch (error) {
        setLoading(false);
        setStatus({ success: false, msg: 'failed' });
      }
    };
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${username}`,
          {
            headers: {
              authorization: `Bearer ${UserData?.token}`,
            },
          }
        );
        setUserData(data);
        setLoading(false);
        setStatus({ success: true, msg: 'success' });
      } catch (error) {
        setLoading(false);
        setStatus({ success: false, msg: 'failed' });
      }
    };
    fetchUserData();
    fetchPosts();
  }, [UserData, username]);

  const followHandler = async (action: 'follow' | 'unfollow') => {
    try {
      if (action === 'follow') {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${username}/follow`,
          { username: UserData?.username },
          {
            headers: {
              authorization: `Bearer ${UserData?.token}`,
            },
          }
        );
      }
      if (action === 'unfollow') {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${username}/unfollow`,
          { username: UserData?.username },
          {
            headers: {
              authorization: `Bearer ${UserData?.token}`,
            },
          }
        );
        router.reload();
      }
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    const fetchFollowers = async () => {
      const followersToShow: string[] = userData?.followers.slice(0, 6)!;
      try {
        const promise = await Promise.all(
          followersToShow?.map(
            async (fol): Promise<{ pic: string; name: string }> => {
              const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/users/${fol}`,
                {
                  headers: {
                    authorization: `Bearer ${UserData?.token}`,
                  },
                }
              );
              return { name: data?.username, pic: data?.profilePic };
            }
          )
        );

        setFollowers(promise);
      } catch (error) {}
    };
    const fetchFollowings = async () => {
      const followingsToShow: string[] = userData?.following.slice(0, 6)!;
      try {
        const promise = await Promise.all(
          followingsToShow?.map(
            async (fol): Promise<{ pic: string; name: string }> => {
              const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/users/${fol}`,
                {
                  headers: {
                    authorization: `Bearer ${UserData?.token}`,
                  },
                }
              );
              return { name: data?.username, pic: data?.profilePic };
            }
          )
        );

        setFollowing(promise);
      } catch (error) {}
    };
    fetchFollowings();
    fetchFollowers();
  }, [userData, UserData]);

  const sendMessgeHandler = async () => {
    try {
      const sender = UserData?.username;
      const receiver = userData?.username;
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        sender,
        receiver,
      });
      dispatch(currentChat(res.data));
      router.push('/chat');
    } catch (error) {}
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading</title>
        </Head>
        <main className={styles.errText}>
          <h1>Loading...</h1>
        </main>
      </>
    );
  }

  return (
    <>
      {status.success ? (
        <>
          <Head>
            <title>{userData?.username} | Profile</title>
          </Head>
          <main className={styles.profilePage}>
            <section className={styles.userProfile}>
              <div className={styles.profileImg}>
                <Image
                  src={userData?.profilePic || '/images/account.png'}
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  className={styles.userImg}
                />
              </div>
              <div className={styles.userName}>
                <h3>{userData?.username}</h3>
                <p>{userData?.bio}</p>
              </div>
              <div className={styles.follow}>
                <button
                  className={styles.messageBtn}
                  onClick={sendMessgeHandler}
                >
                  Message
                </button>
                {userData?.followers?.includes(UserData?.username) ? (
                  <button onClick={() => followHandler('unfollow')}>
                    Followed
                  </button>
                ) : (
                  <button onClick={() => followHandler('follow')}>
                    Follow
                  </button>
                )}
              </div>
              <div className={styles.feedAndFris}>
                <div className={styles.userPosts}>
                  {userPosts?.length ? (
                    userPosts?.map((post: any) => {
                      return (
                        <Post
                          key={post._id}
                          _id={post._id}
                          username={post.username}
                          caption={post.caption}
                          likes={post.likes}
                          comments={post.comments}
                          postImgs={post.postImgs}
                          createdAt={post.createdAt}
                        />
                      );
                    })
                  ) : (
                    <h1>{username} hasn&apos;t made any post</h1>
                  )}
                </div>
                <div className={styles.connectionsContainer}>
                  <div className={styles.connections}>
                    <h3>Followings</h3>
                    <div className={styles.friends}>
                      {following?.map((fol) => (
                        <Link
                          href={
                            UserData.username === fol?.name
                              ? '/profile'
                              : `/profile/${fol.name}`
                          }
                          key={fol.name}
                          passHref
                        >
                          <div className="">
                            <Image
                              src={fol.pic || '/images/account.svg'}
                              alt={fol.name}
                              layout="fill"
                              objectFit="cover"
                              className={styles.folImg}
                            />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className={styles.connections}>
                    <h3>Followers</h3>
                    <div className={styles.friends}>
                      {followers?.map((fol) => (
                        <Link
                          href={
                            UserData.username === fol.name
                              ? '/profile'
                              : `/profile/${fol.name}`
                          }
                          key={fol.name}
                          passHref
                        >
                          <div className="">
                            <Image
                              src={fol.pic || '/images/account.svg'}
                              alt={fol.name}
                              layout="fill"
                              objectFit="cover"
                              className={styles.folImg}
                            />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </>
      ) : (
        <>
          <Head>
            <title>Something Went Wrong</title>
          </Head>
          <main className={styles.errText}>
            <h1>Something Went Wrong</h1>
            <h3>May be your connection is disconnected</h3>
          </main>
        </>
      )}
    </>
  );
};

export default Profile;
