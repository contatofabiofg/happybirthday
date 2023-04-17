/* eslint-disable no-undef */
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import {
  doc,
  collection,
  setDoc,
  getDocs,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore'
import { ref } from 'vue'
import { FirebaseAuthentication } from '@capacitor-firebase/authentication'
import { PushNotifications } from '@capacitor/push-notifications'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

export const firebaseConfig = {
  apiKey: 'AIzaSyCPahw5Gur6j73ppI1emMW8e--6Naz62ss',
  authDomain: 'happybirthday-e7395.firebaseapp.com',
  projectId: 'happybirthday-e7395',
  storageBucket: 'happybirthday-e7395.appspot.com',
  messagingSenderId: '868336108622',
  appId: '1:868336108622:web:f45cefafca2b7ef5d72f1f',
}

const firebaseApp = initializeApp(firebaseConfig)

export const keyFire = ref(0)
const db = getFirestore(firebaseApp)
export const userCol = ref(null)

export const createUserWithEmailAndPassword = async (e, p) => {
  const result = await FirebaseAuthentication.createUserWithEmailAndPassword({
    email: e,
    password: p,
  })
  return result.user
}

export const getCurrentUser = async () => {
  const result = await FirebaseAuthentication.getCurrentUser()
  userCol.value = result.user.email
  userStore.user = result.user.email
  return result.user
}

export const signInWithGoogle = async () => {
  let result

  try {
    result = await FirebaseAuthentication.signInWithGoogle()
    let user = await getCurrentUser()
    userCol.value = user.email
  } catch (e) {
    console.log(e)
  }

  return result.user
}

export const sendPasswordResetEmail = async (e) => {
  await FirebaseAuthentication.sendPasswordResetEmail({
    email: e,
  })
}

export const signOut = async () => {
  await FirebaseAuthentication.signOut()
}

export async function createName(item) {
  if (!userCol.value) {
    await getCurrentUser().then(() => {
      try {
        setDoc(doc(db, userCol.value, item.id), item)
      } catch (e) {
        console.log(e)
      }
    })
  } else {
    setDoc(doc(db, userCol.value, item.id), item)
  }
  keyFire.value++

  await PushNotifications.addListener('registration', (token) => {
    console.info('Registration token: ', token.value)
  })

  await PushNotifications.register()
}

export async function updateName(item) {
  try {
    updateDoc(doc(db, userCol.value, item.id), item)
  } catch (e) {
    alert(e)
  }
  keyFire.value++

  await PushNotifications.addListener('registration', (token) => {
    console.info('Registration token: ', token.value)
  })

  await PushNotifications.register()
}

export async function getAllDocs() {
  let responseData
  if (userStore.user) {
    await getDocs(collection(db, userStore.user)).then((response) => {
      responseData = response
    })
  } else {
    await getCurrentUser().then(async () => {
      await getDocs(collection(db, userCol.value)).then((response) => {
        responseData = response
      })
    })
  }
  return responseData
}

export async function searchName(id) {
  let obj

  if (!userCol.value) {
    await getCurrentUser().then(async () => {
      await getDocs(collection(db, userCol.value)).then((response) => {
        response.forEach((element) => {
          if (element.data().id == id) {
            obj = element.data()
          }
        })
      })
    })
  } else {
    await getDocs(collection(db, userCol.value)).then((response) => {
      response.forEach((element) => {
        if (element.data().id == id) {
          obj = element.data()
        }
      })
    })
  }

  return obj
}

export async function deleteName(id) {
  if (!userCol.value) {
    await getCurrentUser().then(async () => {
      await deleteDoc(doc(db, userCol.value, id))
    })
  } else {
    await deleteDoc(doc(db, userCol.value, id))
  }
  keyFire.value++
}

/*



export async function deleteNames(col) {
  let list = []

  await getDocs(collection(db, col)).then(async (response) => {
    response.forEach((element) => {
      list.push(element.data().name)
    })
    for (let i = 0, j = list.length - 1; i <= j; i++) {
      await deleteDoc(doc(db, col, list[i]))
    }
  })
}

*/
