import Head from 'next/head';
import Feed from '../components/Feed';
import LeftSidebar from '../components/LeftSidebar';
import styles from '../styles/index.module.scss';
import RightSideBar from '../components/RightSidebar';

const Home = () => {
  return (
    <>
      <Head>
        <title>Connect | Feed</title>
      </Head>
      <main className={styles.landing}>
        <LeftSidebar />
        <Feed />
        <RightSideBar />
      </main>
    </>
  );
};

export default Home;
