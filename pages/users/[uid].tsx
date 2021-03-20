import { useRouter } from 'next/router'
import firebase from 'firebase/app'
import { FormEvent,　useEffect, useState } from 'react'
import { User } from '../../models/User'
import Layout from '../../components/Layout'
import { toast } from 'react-toastify';

type Query = {
  uid: string
}

export default function UserShow() {
  const [user, setUser] = useState<User>(null)
  const router = useRouter()
  const query = router.query as Query
  const [body, setBody] = useState('')
  const [isSending, setIsSending] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
  
    setIsSending(true)

    await firebase.firestore().collection('questions').add({
      senderUid: firebase.auth().currentUser.uid,
      receiverUid: user.uid,
      body,
      isReplied: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })

    setIsSending(false)
  
    setBody('')
    alert('質問を送信しました。')
  }
  
  useEffect(() => {
    if (query.uid === undefined) {
      return
    }
    async function loadUser() {
      const doc = await firebase
        .firestore()
        .collection('users')
        .doc(query.uid)
        .get()

      if (!doc.exists) {
        return
      }

      const gotUser = doc.data() as User
      gotUser.uid = doc.id
      setUser(gotUser)
    }
    loadUser()
  }, [query.uid])

  return (
    
  <div className="row justify-content-center mb-3">
      <Layout>
    {user && (
      <div className="text-center">
        <h1 className="h4">{user.name}さんのページ</h1>
        <div className="m-5">{user.name}さんに質問しよう！</div>
      </div>
    )}
  </Layout>
  <div className="row justify-content-center mb-3">
    <div className="col-12 col-md-6">
        <form onSubmit={onSubmit}>
            <textarea
                className="form-control"
                placeholder="おげんきですか？"
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
            ></textarea>
            <div className="m-3">
                <button type="submit" className="btn btn-primary">
                質問を送信する
                </button>
            </div>
        </form>
    </div>
　　</div>
</div>
  )
}
