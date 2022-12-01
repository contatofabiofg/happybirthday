<script setup>
import {
  IonPage,
  IonFab,
  IonFabButton,
  IonLabel,
  IonIcon,
  IonContent,
} from '@ionic/vue'
import { ref, watch, require } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getUsersAndDates } from '../services/localNotifications'
import { getAllDocs, keyFire } from '../services/firebase'
import { arrowBack } from 'ionicons/icons'

const result = ref('')
const resultOrder = ref('')

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
}

watch(keyFire, () => {
  console.log('watchKeyFire2')
  getData()
})

const auth = getAuth()

onAuthStateChanged(auth, async () => {
  //let usuario = await getCurrentUser()
  //collection.value = usuario.email
  getData()
})

async function getData() {
  loading.value = true
  result.value = []
  resultOrder.value = []

  let data = await getAllDocs()

  if (data) {
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
  }

  loading.value = false

  ordenar()
  getUsersAndDates()
}

function editarPessoa(id) {
  router.push('/person/' + id)
}

function showEmoji(img) {
  return require('../theme/emoji/' + img)
}

const router = useRouter()
</script>
<template>
  <ion-page class="flex flex-col justify-start">
    <ion-content>
      <ion-fab class="fixed bottom-5 right-5">
        <ion-fab-button @click="router.push('/home')">
          <ion-icon :icon="arrowBack"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <!-- Próximos Aniversários -->
      <div
        class="mt-20 mx-auto p-2 w-[95%] flex flex-col rounded-xl bg-white drop-shadow-xl"
      >
        <div class="my-3 w-full font-bold flex justify-center items-center">
          <ion-label>Aniversariantes Cadastrados: </ion-label>
          <img
            src="../theme/refresh.png"
            class="ml-3 w-4 cursor-pointer"
            @click="getData()"
            alt="atualizar"
          />
        </div>
        <div v-if="!loading && resultOrder.length > 0">
          <div class="overflow-scroll">
            <li :inset="true" v-for="(item, index) in resultOrder" :key="index">
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
        <div v-if="!loading && resultOrder.length == 0" class="">
          <img src="../theme/emptylist.png" alt="" class="w-56 mx-auto mb-10" />
        </div>
        <div v-if="loading" class="">
          <img src="../theme/spinner.gif" alt="" class="w-24 m-auto my-10" />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
