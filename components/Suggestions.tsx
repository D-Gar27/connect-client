import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from '../styles/components/Suggestion.module.scss';

type SugProps = [
  {
    username: string;
    profilePic: string;
  }
];

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState<SugProps>();

  const UserData = useSelector((state: any) => state?.user?.user);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/random`,
          {
            headers: { authorization: `Bearer ${UserData?.token}` },
          }
        );
        const removedCurrentUser = data?.filter(
          (user: any) => user.username !== UserData?.username
        );
        const removedFollowed = removedCurrentUser?.filter(
          (user: any) => !user?.followers?.includes(UserData?.username)
        );
        setSuggestions(removedFollowed);
      } catch (error) {}
    };
    fetchSuggestions();
  }, [UserData]);

  return (
    <section className={styles.suggestion}>
      <h1>Connect with your new friends</h1>
      {suggestions &&
        suggestions.map((user) => (
          <div key={user.username} className={styles.user}>
            <Link href={`/profile/${user.username}`} passHref>
              <figure className={styles.userImg}>
                <Image
                  src={user.profilePic || '/images/account.svg'}
                  alt={user.username}
                  layout="fill"
                  objectFit="cover"
                  className={styles.img}
                />
              </figure>
            </Link>
            <Link href={`/profile/${user.username}`} passHref>
              <a>{user.username}</a>
            </Link>
            <FollowButton UserData={UserData} user={user} />
          </div>
        ))}
    </section>
  );
};

export default Suggestions;

interface ButtonProps {
  UserData: {
    username: string;
    token: string;
  };
  user: {
    username: string;
  };
}

const FollowButton = ({ user, UserData }: ButtonProps) => {
  const [followed, setFollowed] = useState<boolean>(false);
  const followUser = async (username: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${username}/follow`,
        { username: UserData?.username },
        {
          headers: {
            authorization: `Bearer ${UserData?.token}`,
          },
        }
      );
      setFollowed(true);
    } catch (error) {}
  };
  const unfollowUser = async (username: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${username}/unfollow`,
        { username: UserData?.username },
        {
          headers: {
            authorization: `Bearer ${UserData?.token}`,
          },
        }
      );
      setFollowed(false);
    } catch (error) {}
  };
  return (
    <>
      {followed ? (
        <button onClick={() => unfollowUser(user.username)}>Followed</button>
      ) : (
        <button onClick={() => followUser(user.username)}>Follow</button>
      )}
    </>
  );
};
