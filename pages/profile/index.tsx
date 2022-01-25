import axios from 'axios';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Post from '../../components/Post';
import styles from '../../styles/pages/Profile.module.scss';
import { AiOutlineLogout } from 'react-icons/ai';
import { RiUserSettingsFill } from 'react-icons/ri';
import Head from 'next/head';
import { useSelector } from 'react-redux';

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
      _id: string;
      username: string;
      caption: string;
      userImg: string;
      postImgs: [string];
      likes: [string];
      comments: [];
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

  const UserData = useSelector((state: any) => state?.user?.user);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${UserData?.username}/posts`,
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
          `${process.env.NEXT_PUBLIC_API_URL}/users/${UserData?.username}`,
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
  }, [UserData]);

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
  }, [UserData, userData]);

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading...</title>
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
            <title>{UserData?.username} | Profile</title>
          </Head>
          <main className={styles.profilePage}>
            <section className={styles.userProfile}>
              <div className={styles.profileImg}>
                <Image
                  src={userData?.profilePic || '/images/account.svg'}
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  className={styles.userImg}
                />
              </div>
              <div className={styles.userName}>
                <h3>{userData?.username}</h3>
                <p>
                  {!userData?.bio
                    ? 'Add a brief introduction about yourself'
                    : userData?.bio}
                </p>
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
                  ) : loading ? (
                    <h1>Loading...</h1>
                  ) : (
                    <h1>No posts to show yet</h1>
                  )}
                </div>
                <div className={styles.connectionsContainer}>
                  <div className={styles.connections}>
                    <h3>Followings</h3>
                    <div className={styles.friends}>
                      {following &&
                        following?.map((fol) => (
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
                      {followers &&
                        followers?.map((fol) => (
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
                  <Link href={'/setting'} passHref>
                    <button className={styles.edit}>
                      Edit Profile{' '}
                      <RiUserSettingsFill className={styles.editIcon} />
                    </button>
                  </Link>
                  <button
                    className={styles.logout}
                    onClick={() => {
                      signOut({ redirect: false });
                      return router.push('/sign-in');
                    }}
                  >
                    Log Out <AiOutlineLogout />
                  </button>
                </div>
              </div>
            </section>
          </main>{' '}
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
