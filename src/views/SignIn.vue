<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createUserWithEmailAndPassword } from '../services/firebase'
import { IonPage, IonButton, IonFab, IonFabButton, IonIcon } from '@ionic/vue'
import { arrowBack } from 'ionicons/icons'

const router = useRouter()
const emailInput = ref('')
const passInput = ref(null)
const loading = ref(false)

function register() {
  try {
    createUserWithEmailAndPassword(emailInput.value, passInput.value).then(
      () => {
        alert('Cadastro concluído com sucesso!')
        router.push('/login')
      }
    )
  } catch (e) {
    alert(e)
  }
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
      />
      <label for="pass">Senha</label>
      <input
        class="border border-slate-400 rounded w-full p-2 my-2 outline-none duration-100 focus:drop-shadow-md"
        type="password"
        id="pass"
        v-model="passInput"
      />

      <ion-button class="my-3" shape="round" @click="register()"
        >Registrar</ion-button
      >
    </div>
    <div
      v-if="loading"
      class="w-screen h-screen flex justify-center items-center bg-white/10 backdrop-blur-sm fixed left-0 top-0 z-10"
    >
      <img src="../theme/spinner.gif" alt="carregando" class="w-32" />
    </div>

    <ion-fab class="fixed bottom-5 right-5">
      <ion-fab-button @click="router.push('/login')">
        <ion-icon :icon="arrowBack"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </ion-page>
</template>

<style scoped></style>
