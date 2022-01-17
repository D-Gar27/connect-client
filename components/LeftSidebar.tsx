import { useState } from 'react';
import styles from '../styles/components/Sidebar.module.scss';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return <aside className={styles.leftSidebar}>Sidbar</aside>;
};

export default Sidebar;
