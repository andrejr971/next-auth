import { setupAPIClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";
import styles from '../styles/home.module.scss';

export default function Metrics() {
  return (
    <div  className={styles.container}>
      <h1>Metrics</h1>
    </div>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get('/me');

  return {
    props: {}
  }
}, {
  permissions: ['metrics.list3'],
  roles: ['administrator'],
})