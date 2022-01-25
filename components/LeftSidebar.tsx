import { useState } from 'react';
import styles from '../styles/components/Sidebar.module.scss';
import Suggestions from './Suggestions';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <aside className={styles.leftSidebar}>
      <div className={styles.suggestion}>
        <Suggestions />
      </div>
    </aside>
  );
};

export default Sidebar;
