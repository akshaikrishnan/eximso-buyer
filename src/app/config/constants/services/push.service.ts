import firebaseConfig from '@/app/config/constants/firebase.config'
import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging'

const app = initializeApp(firebaseConfig)

export function getFirebaseMessaging() {
  if (typeof window === 'undefined') {
    // Return null or throw error if called on server side
    return null
  }
  return getMessaging(app)
}
