import { Link } from 'react-router-dom'

import ilustrationImg from '../assets/images/illustration.svg'
import logo from '../assets/images/logo.svg'

import { Button } from '../components/Button'

import '../styles/auth.scss'

export function NewRoom() {
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
            <form>
              <input type="text" placeholder="Digite o código da sala" />
              <Button type="submit">Criar sala</Button>
            </form>
            <p>Quer entrar em uma sala já existente? <Link to="/">Clique aqui</Link> </p> 
        </div>
      </main>
    </div>
  )
}