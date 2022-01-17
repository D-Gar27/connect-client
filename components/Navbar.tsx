import styles from '../styles/components/Navbar.module.scss';
import { AiFillHome, AiFillMessage } from 'react-icons/ai';
import { FaBell, FaSearch, FaUserAlt } from 'react-icons/fa';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" passHref>
          <h1 style={{ cursor: 'pointer' }}>Connect</h1>
        </Link>
        <div className={styles.search}>
          <FaSearch className={styles.searchIcon} />

          <input type="text" placeholder="Search users" />
        </div>
        <div className={styles.searchMobile}>
          <FaSearch className={styles.searchIcon} />

          {/* <input type="text" placeholder="Search posts,users" /> */}
        </div>
        <ul>
          <Link href="/" passHref>
            <li>
              <AiFillHome />
            </li>
          </Link>
          <li>
            <AiFillMessage />
          </li>
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
