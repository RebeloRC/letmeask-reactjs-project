import { Link, useHistory } from 'react-router-dom'
import { FormEvent, useState } from 'react'

import ilustrationImg from '../assets/images/illustration.svg'
import logo from '../assets/images/logo.svg'


import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'

import '../styles/auth.scss'
import { app } from '../services/firebase'
import { push, ref } from 'firebase/database'
import { getDatabase } from "firebase/database";

const database = getDatabase(app);

export function NewRoom() {
 const { user } = useAuth();

const history = useHistory();
const [newRoom, setNewRoom] = useState('');
 
 async function hanldeCreateRoom(event: FormEvent) {
  event.preventDefault();

  if(newRoom.trim() === '') {
    return;
  }

  const roomRef = ref(database, 'rooms');

  const firebaseRoom = await push(roomRef, {
    title: newRoom,
    authorId: user?.id
  })

  history.push(`/rooms/${firebaseRoom.key}`)

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
            <h2>Crie uma nova sala</h2>
            <form onSubmit={hanldeCreateRoom}>
              <input type="text" placeholder="Digite o código da sala"  onChange={event => setNewRoom(event.target.value)} value = {newRoom}/>
              <Button type="submit">Criar sala</Button>
            </form>
            <p>Quer entrar em uma sala já existente? <Link to="/">Clique aqui</Link> </p> 
        </div>
      </main>
    </div>
  )
}