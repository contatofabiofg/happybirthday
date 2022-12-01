<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUsersAndDates } from '../services/localNotifications'
import { firebaseConfig, sendPasswordResetEmail } from '../services/firebase'
import { IonPage, IonButton, alertController } from '@ionic/vue'
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
} from 'firebase/auth'

import { signInWithGoogle } from '../services/firebase'

initializeApp(firebaseConfig)

const router = useRouter()
const auth = getAuth()
const emailInput = ref('')
const passInput = ref(null)
const loading = ref(true)

onAuthStateChanged(auth, (user) => {
  if (user && user.emailVerified) {
    console.log('vindoDoLogin')
    getUsersAndDates()
    router.push('/home')
  } else {
    loading.value = false
  }
})

function login() {
  signInWithEmailAndPassword(auth, emailInput.value, passInput.value)
    .then(() => {
      if (auth.currentUser.emailVerified) {
        router.push('/home')
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

function handleGoogleLogin() {
  //signInWithRedirect(auth, providerGoogle)
  signInWithGoogle().then(() => {
    router.push('/home')
  })
}

async function resetPass() {
  const alert = await alertController.create({
    header: 'Digite seu E-mail',
    subHeader: 'Vamos enviar um link para você redefinir sua senha',
    buttons: [
      {
        text: 'Enviar',
        handler: (alertData) => {
          //takes the data
          sendPasswordResetEmail(alertData.email)
        },
      },
    ],
    inputs: [
      {
        name: 'email',
        placeholder: 'Email',
      },
    ],
  })
  await alert.present()
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
        <a class="cursor-pointer font-bold" @click="router.push('/signin')"
          >Criar nova conta</a
        >
        <a class="cursor-pointer" @click="resetPass()">Esqueceu a senha?</a>
      </div>
      <ion-button class="my-3" shape="round" @click="login()"
        >Entrar</ion-button
      >

      <ion-button
        fill="outline"
        shape="round"
        class="mb-3 rounded-full"
        @click="handleGoogleLogin"
      >
        <img
          src="../theme/google.png"
          alt=""
          role="presentation"
          class="w-5 mr-2 inline"
        />Entrar com Google
      </ion-button>
    </div>
    <div
      v-if="loading"
      class="w-screen h-screen flex justify-center items-center bg-white/10 backdrop-blur-sm fixed left-0 top-0 z-10"
    >
      <img src="../theme/spinner.gif" alt="" role="presentation" class="w-32" />
    </div>
  </ion-page>
</template>

<style scoped></style>
