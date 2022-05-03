import { useHistory } from 'react-router-dom'

import ilustrationImg from '../assets/images/illustration.svg'
import logo from '../assets/images/logo.svg'
import google from '../assets/images/google-icon.svg'

import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'

import '../styles/auth.scss'

export function Home() {
  const { user, signInWithGoogle } = useAuth()

  const history = useHistory();

  async function handleCreateRoom() {
    if(!user) {
     await signInWithGoogle()
    }

    history.push('/rooms/new');
  }

  return (
    <div id="auth-page">
      <aside>
        <img src={ilustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao vivo.</strong>
        <p>Tire duvidas de sua audiencia em tempo real.</p>
      </aside>
      <main>
        <div className='main-content'>
          <img src={logo} alt="letmeask"/>
          <button onClick={handleCreateRoom} className='create-room'>
            <img src={google} alt="" />
            Crie sua sala com o Google
          </button>
            <div className='separator'>Ou entre em uma sala </div>
            <form>
              <input type="text" placeholder="Digite o código da sala" />
              <Button type="submit">Entrar na sala</Button>
            </form>
        </div>
      </main>
    </div>
  )
}