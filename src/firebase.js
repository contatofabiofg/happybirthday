/* eslint-disable no-undef */
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { doc, collection, setDoc, getDocs, deleteDoc } from 'firebase/firestore'
//import { ref, onUnmounted } from 'vue'

export const firebaseConfig = {
  apiKey: 'AIzaSyCPahw5Gur6j73ppI1emMW8e--6Naz62ss',
  authDomain: 'happybirthday-e7395.firebaseapp.com',
  projectId: 'happybirthday-e7395',
  storageBucket: 'happybirthday-e7395.appspot.com',
  messagingSenderId: '868336108622',
  appId: '1:868336108622:web:f45cefafca2b7ef5d72f1f',
}

const firebaseApp = initializeApp(firebaseConfig)

const db = getFirestore(firebaseApp)

export async function createName(item, col) {
  setDoc(doc(db, col, item.name), item)
}

export async function getAllDocs(col) {
  let responseData

  await getDocs(collection(db, col)).then((response) => {
    responseData = response
  })

  return responseData
}

export async function searchName(name, pass, col) {
  let obj

  await getDocs(collection(db, col)).then((response) => {
    response.forEach((element) => {
      if (
        element.data().name.toLowerCase() == name.toLowerCase() &&
        element.data().pass == pass
      ) {
        obj = { name: element.data().name, friend: element.data().friend }
      }
    })
  })
  console.log(obj)
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
