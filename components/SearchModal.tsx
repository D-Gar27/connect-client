import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from '../styles/components/SearchModal.module.scss';
import { HiArrowSmRight } from 'react-icons/hi';
import Link from 'next/link';
import { useSelector } from 'react-redux';

interface Props {
  users: [{ username: string; profilePic: string }];
}

const SearchModal = ({ users }: Props) => {
  const [isThereUsers, setIsThereUsers] = useState<boolean>();
  useEffect(() => {
    if (users?.length > 0) {
      setIsThereUsers(true);
    } else {
      setIsThereUsers(false);
    }
  }, [users]);

  const UserData = useSelector((state: any) => state?.user?.user);
  return (
    <section className={styles.searchModal}>
      {isThereUsers ? (
        <>
          {users.map((user) => (
            <Link
              key={user.username}
              href={
                UserData.username === user?.username
                  ? '/profile'
                  : `/profile/${user?.username}`
              }
              passHref
            >
              <a className={styles.user}>
                <figure className={styles.userImg}>
                  <Image
                    src={user.profilePic || '/images/account.svg'}
                    alt={user.username}
                    layout="fill"
                    objectFit="cover"
                    className={styles.img}
                  />
                </figure>
                <p className={styles.username}>{user.username}</p>
                <HiArrowSmRight />
              </a>
            </Link>
          ))}
        </>
      ) : (
        <h4 className={styles.notMatch}>No Users Match</h4>
      )}
    </section>
  );
};

export default SearchModal;
