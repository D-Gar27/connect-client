import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from '../styles/components/SearchModal.module.scss';
import { BsArrowLeft } from 'react-icons/bs';
import { HiArrowSmRight } from 'react-icons/hi';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import axios from 'axios';

const SearchModal = ({ setMobileSearchModal }: any) => {
  const [isThereUsers, setIsThereUsers] = useState<boolean>();
  const [query, setQuery] = useState<string>('');
  const [users, setUsers] = useState<any>();

  useEffect(() => {
    if (users?.length > 0) {
      setIsThereUsers(true);
    } else {
      setIsThereUsers(false);
    }
  }, [users]);

  const UserData = useSelector((state: any) => state?.user?.user);

  const handleQuery = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/random?username=${query}`,
        { headers: { authorization: `Bearer ${UserData?.token}` } }
      );
      setUsers(data);
    } catch (error) {}
  };
  return (
    <section className={styles.mobileSearchModal}>
      <div className={styles.mobileInput}>
        <BsArrowLeft onClick={() => setMobileSearchModal(false)} />
        <input
          type="text"
          placeholder="Search users"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            return handleQuery();
          }}
        />
      </div>
      {isThereUsers ? (
        <>
          {users.map((user: any) => (
            <Link
              key={user.username}
              href={
                UserData.username === user?.username
                  ? '/profile'
                  : `/profile/${user?.username}`
              }
              passHref
            >
              <a
                className={styles.user}
                onClick={() => setMobileSearchModal(false)}
              >
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
