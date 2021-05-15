import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { FormEvent, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/home.module.scss';
import { withSSRGuest } from '../utils/withSSRGuest';

export default function Home() {
  const [email, setEmail] = useState('diego@rocketseat.team');
  const [password, setPassword] = useState('');

  const { signIn } = useAuth();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const data = {
      email,
      password
    }

    await signIn(data)
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-mail"
          onChange={({target}) => setEmail(target.value)} 
          autoComplete="true"
          defaultValue={email}
        />
        <input
          type="password"
          placeholder="Senha"
          onChange={({target}) => setPassword(target.value)} 
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  )
}


export const getServerSideProps = withSSRGuest(async (ctx) => {
  return  {
    props: {}
  }
})