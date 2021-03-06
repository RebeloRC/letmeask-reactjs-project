import { getDatabase, onValue, push, ref } from 'firebase/database';
import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import logo from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';

import { useAuth } from '../hooks/useAuth';
import { app } from '../services/firebase';

import '../styles/room.scss';

const database = getDatabase(app);

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}>

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}


type RoomParams = {
  id: string;
}

export function Room(){
  const { user } = useAuth();

  const params = useParams<RoomParams>();
  const roomId = params.id;

  const [newQuestion, setNewQuestion] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [title, setTitle] = useState('');

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomId}`);
    
    onValue(roomRef, (room) => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions;

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
        }
      })

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)

      console.log(parsedQuestions)
    });

  }, [roomId]);

  async function handleSendQuestion(event: FormEvent){
    event.preventDefault();

    if(newQuestion.trim() === ''){
      return;
    }

    if(!user){
      throw new Error ('You must be logged in')
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false
    };

    const questionRefId = ref(database, `rooms/${roomId}/questions`);
    await push(questionRefId, {question})

    setNewQuestion('');
  }

  return(
    <div id="page-room">
      <header>
        <div className='content'>
          <img src={logo} alt="Letmeask" />
          <RoomCode code={roomId}/>
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} perguntas</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea placeholder='O que voc?? quer perguntar ?' onChange={event => setNewQuestion(event.target.value)} value ={newQuestion} />

          <div className="form-footer">
            { user ? 
            (<div className='user-info'>
              <img src={user.avatar} alt={user.name}/>
              <span>{user.name}</span>
            </div>
            ) : (
            <span>Para enviar uma perginta, <button>Fa??a seu login </button>.</span>)  }
            <Button type="submit" disabled={!user} >Enviar pergunta</Button>
          </div>
        </form>

        <div className='question-list'>
        {questions.map(question => {
            return(
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              />
            )
          })}
        </div>
      </main>
    </div>
  );
}