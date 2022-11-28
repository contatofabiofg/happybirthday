<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonRouterOutlet,
} from '@ionic/vue'
import { useRouter } from 'vue-router'

import { signOut } from '../firebase'

const router = useRouter()

async function logout() {
  await signOut()
  router.push('/login')
}
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <img
          src="../theme/logo.png"
          alt="Logo Happy Birthday"
          class="w-48 m-auto my-3"
        />
        <img
          src="../theme/logout.png"
          alt=""
          class="absolute top-5 right-5 w-5 cursor-pointer"
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
