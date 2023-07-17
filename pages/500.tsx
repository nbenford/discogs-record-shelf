import styles from '../styles/Home.module.css';
const PageNotFound = () => {
  return (
    <div className={styles.errorContainer}>
      <span className={styles.errorHeading}>
        <h1>500 |</h1>
        <h2> SERVER-SIDE ERROR</h2>
        <h3>Sorry. We couldn&apos;t complete the requested operation.</h3>
        <h4> ¯\_(ツ)_/¯</h4>
      </span>
    </div>
  );
};

export default PageNotFound;
