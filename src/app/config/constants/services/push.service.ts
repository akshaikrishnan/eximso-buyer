import firebaseConfig from '@/app/config/constants/firebase.config'
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

const app = initializeApp(firebaseConfig)
export const messaging = getMessaging(app)