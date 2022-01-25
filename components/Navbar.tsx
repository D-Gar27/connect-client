import styles from '../styles/components/Navbar.module.scss';
import { AiFillHome, AiFillMessage } from 'react-icons/ai';
import { FaBell, FaSearch, FaUserAlt } from 'react-icons/fa';
import Link from 'next/link';
import { useState } from 'react';
import SearchModal from './SearchModal';
import MobileSearchModal from './MobileSearchModal';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const [searchModal, setSearchModal] = useState<boolean>(false);
  const [mobileSearchModal, setMobileSearchModal] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [users, setUsers] = useState<any>();

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
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" passHref>
          <h1 style={{ cursor: 'pointer' }}>Connect</h1>
        </Link>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Search users"
            value={query}
            onBlur={() => {
              setSearchModal(true);
              setTimeout(() => setSearchModal(false), 200);
            }}
            onFocus={() => {
              setSearchModal(true);
            }}
            onChange={(e) => {
              setQuery(e.target.value);
              return handleQuery();
            }}
          />
          <FaSearch className={styles.searchIcon} />
          {searchModal && <SearchModal users={users} />}
        </div>
        <div className={styles.searchMobile}>
          <FaSearch
            className={styles.searchIcon}
            onClick={() => setMobileSearchModal(true)}
          />
          {mobileSearchModal && (
            <MobileSearchModal setMobileSearchModal={setMobileSearchModal} />
          )}
        </div>
        <ul>
          <Link href="/" passHref>
            <li>
              <AiFillHome />
            </li>
          </Link>
          <Link href="/chat" passHref>
            <li>
              <AiFillMessage />
            </li>
          </Link>
          <li>
            <FaBell />
          </li>
          <Link href="/profile" passHref>
            <li>
              <FaUserAlt />
            </li>
          </Link>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
