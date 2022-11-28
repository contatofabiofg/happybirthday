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

export const getCurrentUser = async () => {
  const result = await FirebaseAuthentication.getCurrentUser()
  return result.user
}

export const signInWithGoogle = async () => {
  let result

  try {
    result = await FirebaseAuthentication.signInWithGoogle()
    let user = await getCurrentUser()
    userCol.value = user.email
  } catch (e) {
    alert(e)
  }

  return result.user
}

export const signOut = async () => {
  await FirebaseAuthentication.signOut()
}

export async function createName(item) {
  setDoc(doc(db, userCol.value, item.name), item)
  keyFire.value++
}

export async function updateName(item) {
  try {
    updateDoc(doc(db, userCol.value, item.name), item)
  } catch (e) {
    alert(e)
  }
  keyFire.value++
}

export async function getAllDocs(col) {
  let responseData

  await getDocs(collection(db, col)).then((response) => {
    responseData = response
  })

  return responseData
}

export async function searchName(id) {
  let obj
  console.log('abaixo')
  console.log(id)
  console.log(userCol.value)

  await getDocs(collection(db, userCol.value)).then((response) => {
    response.forEach((element) => {
      if (element.data().id == id) {
        obj = element.data()
      }
    })
  })

  return obj
}

/*

export const getName = async (id) => {
  const name = await namesCollection.doc(id).get();
  return name.exists ? name.data() : null;
};

export const updateName = (id, name) => {
  return namesCollection.doc(id).update(name);
};
*/
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
