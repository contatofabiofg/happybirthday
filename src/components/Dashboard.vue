<script setup>
import { IonPage, IonFab, IonFabButton, IonLabel, IonIcon } from '@ionic/vue'
import { ref, watch, require } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

import { getAllDocs, getCurrentUser, keyFire } from '../firebase'
import { add } from 'ionicons/icons'

const result = ref('')
const resultOrder = ref('')
const nextBirths = ref([])
const collection = ref('')
const loading = ref(true)
const date = new Date()
// eslint-disable-next-line no-unused-vars
const atualMonth = date.getMonth() + 1

function ordenar() {
  let today = new Date()
  let year = today.getFullYear()
  resultOrder.value = result.value.sort(function (a, b) {
    return (
      new Date(year, a.month - 1, a.day) - new Date(year, b.month - 1, b.day)
    )
  })
  resultOrder.value.forEach((element) => {
    console.log(new Date(year, element.month - 1, element.day))
    if (new Date(year, element.month - 1, element.day) > new Date()) {
      nextBirths.value.push(element)
    }
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
  resultOrder.value = []
  nextBirths.value = []

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
  <ion-page class="flex flex-col justify-start">
    <ion-fab class="fixed bottom-5 right-5">
      <ion-fab-button @click="router.push('/cadastro')">
        <ion-icon :icon="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>
    <!-- Próximos Aniversários -->
    <div
      class="mt-20 mx-auto p-2 w-[95%] flex flex-col rounded-xl bg-white drop-shadow-xl"
    >
      <ion-label class="my-3 text-center font-bold"
        >Próximos Aniversários:
      </ion-label>
      <div v-if="!loading && nextBirths.length > 0">
        <div class="overflow-scroll">
          <li :inset="true" v-for="(item, index) in nextBirths" :key="index">
            <ul
              class="w-full flex justify-between items-center p-2 rounded-3xl mb-3 drop-shadow cursor-pointer bg-gradient-to-r from-slate-100 to-slate-50"
              @click="editarPessoa(item.id)"
            >
              <div class="flex items-center">
                <span>
                  <div
                    class="w-8 border-2 border-slate-300 mr-2 bg-white/50 p-1 rounded-full"
                  >
                    <img
                      :src="showEmoji(item.img)"
                      alt="emoticon"
                      class="w-5"
                    />
                  </div>
                </span>
                <span class="font-bold">{{ item.name }}</span>
              </div>

              <span class="mr-2">{{ item.day }}/{{ item.month }}</span>
            </ul>
          </li>
        </div>
      </div>
      <div v-if="!loading && nextBirths.length == 0" class="">
        <img src="../theme/emptylist.png" alt="" class="w-56 mx-auto mb-10" />
      </div>
      <div v-if="loading" class="">
        <img src="../theme/spinner.gif" alt="" class="w-24 m-auto my-10" />
      </div>
    </div>

    <!-- Receitas -->
    <div
      class="mt-3 mx-auto p-2 w-[95%] flex flex-col rounded-xl bg-white drop-shadow-xl"
    >
      <ion-label class="my-2 text-center font-bold">Receitas: </ion-label>
      <div class="w-full">
        <div class="flex justify-between">
          <div
            class="flex justify-center items-center w-full py-2 px-4 bg-gradient-to-r from-slate-100 to-slate-50 drop-shadow rounded-xl text-center font-bold m-1"
          >
            <span><img src="../theme/bolo.png" alt="" class="w-4 mr-2" /></span>
            Bolos
          </div>
          <div
            class="flex justify-center items-center w-full py-2 px-4 bg-gradient-to-r from-slate-100 to-slate-50 drop-shadow rounded-xl text-center font-bold m-1"
          >
            <span
              ><img src="../theme/coxinha.png" alt="" class="w-4 mr-2"
            /></span>
            Salgadinhos
          </div>
        </div>
        <div class="flex justify-between">
          <div
            class="flex justify-center items-center w-full py-2 px-4 bg-gradient-to-r from-slate-100 to-slate-50 drop-shadow rounded-xl text-center font-bold m-1"
          >
            <span
              ><img src="../theme/pastel.png" alt="" class="w-4 mr-2"
            /></span>
            Pastéis
          </div>
          <div
            class="flex justify-center items-center w-full py-2 px-4 bg-gradient-to-r from-slate-100 to-slate-50 drop-shadow rounded-xl text-center font-bold m-1"
          >
            <span
              ><img src="../theme/torta.png" alt="" class="w-4 mr-2"
            /></span>
            Torta Salgada
          </div>
        </div>
      </div>
    </div>

    <!-- Presentes -->
    <div
      class="mt-3 mx-auto p-2 w-[95%] flex flex-col rounded-xl bg-white drop-shadow-xl"
    >
      <ion-label class="my-2 text-center font-bold"
        >Dicas de presente:
      </ion-label>
      <div class="w-full">
        <div class="flex justify-between">
          <div
            class="w-full py-2 px-4 bg-gradient-to-r from-slate-100 to-slate-50 drop-shadow rounded-xl text-center font-bold m-1"
          >
            Passeios
          </div>
          <div
            class="w-full py-2 px-4 bg-gradient-to-r from-slate-100 to-slate-50 drop-shadow rounded-xl text-center font-bold m-1"
          >
            Restaurante
          </div>
        </div>
        <div class="flex justify-between">
          <div
            class="w-full py-2 px-4 bg-gradient-to-r from-slate-100 to-slate-50 drop-shadow rounded-xl text-center font-bold m-1"
          >
            Baratinhos
          </div>
          <div
            class="w-full py-2 px-4 bg-gradient-to-r from-slate-100 to-slate-50 drop-shadow rounded-xl text-center font-bold m-1"
          >
            Por conexão
          </div>
        </div>
      </div>
    </div>
  </ion-page>
</template>
