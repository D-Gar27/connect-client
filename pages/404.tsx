import styles from '../styles/pages/NotFound.module.scss';

const PageNotFound = () => {
  return (
    <main className={styles.notFound}>
      <div className={styles.text}>
        <h1>404</h1>
        <p>Page not found</p>
      </div>
    </main>
  );
};

export default PageNotFound;
