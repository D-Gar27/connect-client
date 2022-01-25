import Head from 'next/head';
import styles from '../styles/pages/NotFound.module.scss';

const PageNotFound = () => {
  return (
    <>
      <Head>
        <title>404 | Page Not Found</title>
      </Head>
      <main className={styles.notFound}>
        <div className={styles.text}>
          <h1>404</h1>
          <p>Page not found</p>
        </div>
      </main>
    </>
  );
};

export default PageNotFound;
