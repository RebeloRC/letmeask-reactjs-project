import { useHistory } from 'react-router-dom'

import ilustrationImg from '../assets/images/illustration.svg'
import logo from '../assets/images/logo.svg'
import google from '../assets/images/google-icon.svg'

import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'

import '../styles/auth.scss'
import { FormEvent, useState } from 'react'
import { child, get, getDatabase, ref } from 'firebase/database'
import { app } from '../services/firebase'

export function Home() {
  const { user, signInWithGoogle } = useAuth()
  const [roomCode, setRoomCode] = useState('');

  const database = getDatabase(app);

  const history = useHistory();

  async function handleCreateRoom() {
    if(!user) {
     await signInWithGoogle()
    }

    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if(roomCode.trim() === '') {
      return;
    }
    
    const roomRef = ref(getDatabase(app));

    get(child(roomRef, `rooms/${roomCode}`)).then((snapshot) => {
      if (!snapshot.exists()) {
        console.log('Sala invalida!');
        return;
      }

      history.push(`rooms/${roomCode}`)
    });
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
            <form onSubmit={handleJoinRoom}>
              <input type="text" placeholder="Digite o código da sala" onChange={event => setRoomCode(event.target.value)} value={roomCode} />
              <Button type="submit">Entrar na sala</Button>
            </form>
        </div>
      </main>
    </div>
  )
}