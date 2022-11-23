<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRouterOutlet,
} from '@ionic/vue'
import { useRouter } from 'vue-router'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '../firebase'
import { getAuth } from 'firebase/auth'

initializeApp(firebaseConfig)
const auth = getAuth()
const router = useRouter()

function logout() {
  auth.signOut()

  router.push('/login')
}
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title class="relative">Happy Birthday!</ion-title>
        <img
          src="../theme/logout.png"
          alt=""
          class="absolute top-3 right-5 w-5 cursor-pointer"
          @click="logout()"
        />
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="my-32 p-3">
        <ion-router-outlet />
      </div>
    </ion-content>
  </ion-page>
</template>
