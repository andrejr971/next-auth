import { destroyCookie } from "nookies";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { setupApiClient } from "../services/api";
import { api } from "../services/apiClient";
import { AuthTokenError } from "../services/errors/AuthTokenError";

import styles from '../styles/home.module.scss'
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user } = useAuth();

  useEffect(() => {
    api.get('me').then(response => {
      console.log(response.data)
    }).catch(err => {
      console.log(err)
    });
  }, []);

  return (
    <div className={styles.container}>
      <h1>Dashboard: {user?.email}</h1>
    </div>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupApiClient(ctx);

  const { data } = await apiClient.get('/me');

  console.log(data)

  return {
    props: {}
  }
})