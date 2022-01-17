import styles from '../styles/components/RigthSidebar.module.scss';
import UploadArea from './UploadArea';

const RightSideBar = () => {
  return (
    <aside className={styles.RightSideBar}>
      <UploadArea />
    </aside>
  );
};

export default RightSideBar;
