import styles from '../styles/Home.module.css';
const PageNotFound = () => {
  return (
    <div className={styles.errorContainer}>
      <span className={styles.errorHeading}>
        <h1>404 |</h1>
        <h2> PAGE NOT FOUND</h2>
        <h3>Whoops. We couldn&apos;t find the requested page.</h3>
        <h4> ¯\_(ツ)_/¯</h4>
      </span>
    </div>
  );
};

export default PageNotFound;
