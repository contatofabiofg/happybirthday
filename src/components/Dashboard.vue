<script setup>
import { IonPage, IonButton, IonLabel, IonIcon } from '@ionic/vue'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

import { getAllDocs, getCurrentUser, keyFire } from '../firebase'
import { add } from 'ionicons/icons'

const result = ref('')
const resultOrder = ref('')
const collection = ref('')
const date = new Date()
// eslint-disable-next-line no-unused-vars
const atualMonth = date.getMonth() + 1

function ordenar() {
  resultOrder.value = result.value.sort(function (a, b) {
    return (
      new Date(1990, a.month - 1, a.day) - new Date(1990, b.month - 1, b.day)
    )
  })
}

watch(keyFire, () => {
  getData()
})

const auth = getAuth()

onAuthStateChanged(auth, async () => {
  alert(JSON.stringify(auth))
  let usuario = await getCurrentUser()
  collection.value = usuario.email
  getData()
})

async function getData() {
  result.value = []

  let data = await getAllDocs(collection.value)

  data.forEach((element) => {
    let obj = {
      name: element.data().name,
      day: element.data().day,
      month: element.data().month,
      connection: element.data().connection,
      number: element.data().number,
      sex: element.data().sex,
    }
    result.value.push(obj)
  })

  ordenar()
}

const router = useRouter()
</script>
<template>
  <ion-page>
    <div
      class="mt-16 m-auto p-2 w-[95%] flex flex-col rounded-xl bg-white drop-shadow-md"
    >
      <ion-button
        class="w-full"
        @click="router.push('/cadastro')"
        shape="round"
        color="success"
      >
        <ion-icon :icon="add"></ion-icon>
        Adicionar</ion-button
      >
      <ion-label class="text-center my-5 font-bold"
        >Próximos Aniversários</ion-label
      >
      <div
        v-if="resultOrder.length > 0"
        class="border border-slate-300 rounded"
      >
        <li>
          <ul
            class="w-full flex justify-between border-b border-slate-300 p-3 font-bold bg-slate-200"
          >
            <span> Nome </span>
            <span> Data </span>
          </ul>
        </li>
        <div class="h-56 overflow-scroll">
          <li :inset="true" v-for="(item, index) in resultOrder" :key="index">
            <ul
              class="w-full flex justify-between border-b border-slate-300 p-3"
            >
              <span>{{ item.name }}</span>
              <span>{{ item.day }}/{{ item.month }}</span>
            </ul>
          </li>
        </div>
      </div>
      <div v-else>
        <img src="../theme/spinner.gif" alt="" class="w-16 m-auto" />
      </div>
    </div>
  </ion-page>
</template>
