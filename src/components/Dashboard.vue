<script setup>
import { IonPage, IonFab, IonFabButton, IonLabel, IonIcon } from '@ionic/vue'
import { ref, watch, require } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

import { getAllDocs, getCurrentUser, keyFire } from '../firebase'
import { add } from 'ionicons/icons'

const result = ref('')
const resultOrder = ref('')
const collection = ref('')
const loading = ref(true)
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
      img: element.data().img,
      id: element.data().id,
    }
    result.value.push(obj)
  })

  loading.value = false

  ordenar()
}

function editarPessoa(id) {
  router.push('/cadastro/' + id)
}

function showEmoji(img) {
  return require('../theme/emoji/' + img)
}

const router = useRouter()
</script>
<template>
  <ion-page>
    <ion-fab class="fixed bottom-5 right-5">
      <ion-fab-button @click="router.push('/cadastro')">
        <ion-icon :icon="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>
    <div
      class="mt-20 m-auto p-2 w-[95%] flex flex-col rounded-xl bg-white/95 drop-shadow-xl"
    >
      <ion-label class="my-3">Próximos Aniversários: </ion-label>
      <div v-if="!loading && resultOrder.length > 0">
        <div class="h-[75vh] overflow-scroll">
          <li :inset="true" v-for="(item, index) in resultOrder" :key="index">
            <ul
              class="w-full flex justify-between p-2 border-b border-slate-300"
              :class="[
                index % 2 == 0
                  ? 'bg-gradient-to-r from-slate-100 to-slate-50'
                  : 'bg-gradient-to-r from-blue-100 to-slate-50',
              ]"
              @click="editarPessoa(item.id)"
            >
              <div class="flex items-center">
                <span>
                  <div
                    class="w-10 border-2 border-slate-300 mr-2 bg-white/50 p-1 rounded-full"
                  >
                    <img
                      :src="showEmoji(item.img)"
                      alt="emoticon"
                      class="w-7"
                    />
                  </div>
                </span>
                <span class="text-2xl font-bold">{{ item.name }}</span>
              </div>

              <span class="text-2xl">{{ item.day }}/{{ item.month }}</span>
            </ul>
          </li>
        </div>
      </div>
      <div v-if="!loading && resultOrder.length == 0" class="h-[75vh]">
        <img src="../theme/emptylist.png" alt="" class="w-56 m-auto mt-20" />
      </div>
      <div v-if="loading" class="h-[75vh]">
        <img src="../theme/spinner.gif" alt="" class="w-24 m-auto mt-20" />
      </div>
    </div>
  </ion-page>
</template>
