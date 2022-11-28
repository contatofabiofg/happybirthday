<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { firebaseConfig } from '../firebase'
import { IonPage } from '@ionic/vue'
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  signInWithRedirect,
  signInWithEmailAndPassword,
  FacebookAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
} from 'firebase/auth'

import { signInWithGoogle } from '../firebase'

initializeApp(firebaseConfig)

const router = useRouter()
const auth = getAuth()
const emailInput = ref('')
const passInput = ref(null)
const providerFacebook = new FacebookAuthProvider()

const loading = ref(true)

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    //const uid = user.uid;
    router.push('/dashboard')
    // ...
  } else {
    loading.value = false
    // User is signed out
    // ...
  }
})

function login() {
  signInWithEmailAndPassword(auth, emailInput.value, passInput.value)
    .then(() => {
      if (auth.currentUser.emailVerified) {
        router.push({ name: 'Home' })
      } else {
        if (
          window.confirm(
            'Email não verificado. Gostaria de receber um email de verificação?'
          )
        ) {
          sendEmailVerification(auth.currentUser)
            .then(() => {
              alert('E-mail de verificação enviado! :)')
            })
            .catch((error) => {
              alert('E-mail de verificação não enviado! :(' + error)
            })
        } else {
          return false
        }
      }
    })
    .catch((error) => {
      alert(error)
    })
}

function handleFacebookLogin() {
  signInWithRedirect(auth, providerFacebook)
}

function handleGoogleLogin() {
  //signInWithRedirect(auth, providerGoogle)
  signInWithGoogle().then(() => {
    router.push('/dashboard')
  })
}
</script>

<template>
  <ion-page>
    <div
      class="mt-16 m-auto p-2 w-[95%] flex flex-col rounded-xl bg-white drop-shadow-md"
    >
      <img
        src="../theme/logo.png"
        alt="Logo Happy Birthday"
        class="w-60 m-auto my-3"
      />
      <label for="email">Email</label>
      <input
        class="border border-slate-400 rounded w-full p-2 my-2 outline-none duration-100 focus:drop-shadow-md"
        type="text"
        id="email"
        v-model="emailInput"
        @keyup.enter="login()"
      />
      <label for="pass">Senha</label>
      <input
        class="border border-slate-400 rounded w-full p-2 my-2 outline-none duration-100 focus:drop-shadow-md"
        type="password"
        id="pass"
        v-model="passInput"
        @keyup.enter="login()"
      />
      <div class="flex justify-between text-xs my-2">
        <a href="" @click="router.push({ name: 'SiginUp' })"
          >Criar nova conta</a
        >
        <a href="" @click="router.push({ name: 'ResetPass' })"
          >Esqueceu a senha?</a
        >
      </div>
      <button @click="login()">Entrar</button>

      <div
        tabindex="0"
        class="w-full p-3 border bg-white rounded-md drop-shadow-lg hover:bg-slate-100 border-slate-200 mb-2 mt-4 text-center cursor-pointer select-none"
        @click="handleFacebookLogin"
      >
        Entrar com Facebook
        <img
          src="../theme/facebook.png"
          alt=""
          role="presentation"
          class="w-5 ml-1 inline"
        />
      </div>
      <div
        tabindex="0"
        class="w-full p-3 border bg-white rounded-md drop-shadow-lg hover:bg-slate-100 border-slate-200 text-center cursor-pointer select-none"
        @click="handleGoogleLogin"
      >
        Entrar com Google
        <img
          src="../theme/google.png"
          alt=""
          role="presentation"
          class="w-5 ml-1 inline"
        />
      </div>
    </div>
    <div
      v-if="loading"
      class="w-screen h-screen flex justify-center items-center bg-white/10 backdrop-blur-sm fixed left-0 top-0 z-10"
    >
      <img src="../theme/spinner.gif" alt="carregando" class="w-32" />
    </div>
  </ion-page>
</template>

<style scoped></style>
