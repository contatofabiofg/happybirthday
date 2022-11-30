<script setup>
import { ref, onMounted } from 'vue'
import { IonPage, IonFab, IonFabButton, IonIcon, IonContent } from '@ionic/vue'
import { useRouter, useRoute } from 'vue-router'
import { arrowBack } from 'ionicons/icons'
import { recipes } from '../services/recipes'

const router = useRouter()
const route = useRoute()
const recipeList = ref(null)
const title = ref(null)

onMounted(() => {
  if (route.params.category) {
    let category = route.params.category
    recipeList.value = recipes[category]

    switch (category) {
      case 'cakes':
        title.value = 'Bolos'
        break
      case 'pies':
        title.value = 'Tortas'
        break
      case 'pastries':
        title.value = 'Pastéis'
        break
      case 'snacks':
        title.value = 'Salgadinhos'
        break
    }
  }
})
</script>
<template>
  <ion-page class="flex flex-col justify-start">
    <ion-content>
      <ion-fab class="fixed bottom-5 right-5">
        <ion-fab-button @click="router.push('/home')">
          <ion-icon :icon="arrowBack"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <div
        class="mt-20 mb-5 mx-auto p-2 w-[95%] flex flex-col rounded-xl bg-white drop-shadow-xl"
      >
        <h1 class="text-center font-bold text-3xl my-3">
          {{ title }}
        </h1>

        <hr />

        <div v-for="(element, index) in recipeList" :key="index">
          <h2 class="text-center font-bold text-lg my-3">{{ element.name }}</h2>

          <h3 class="my-2">Ingredientes:</h3>
          <ul v-for="(ingredient, index2) in element.ingredients" :key="index2">
            <li>- {{ ingredient }}</li>
          </ul>
          <h3 class="my-2">Modo de preparo:</h3>
          <p class="mb-5">{{ element.preparation }}</p>

          <hr />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
