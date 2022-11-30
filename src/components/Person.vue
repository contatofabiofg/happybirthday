<script setup>
import {
  IonPage,
  IonContent,
  IonRadio,
  IonRadioGroup,
  IonItem,
  IonList,
  IonIcon,
  IonButton,
  IonFab,
  IonFabButton,
  IonLabel,
  IonSelect,
  IonSelectOption,
  alertController,
} from '@ionic/vue'
import { computed, ref, watch, onMounted, require } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { createName, searchName, updateName } from '../services/firebase'
import { arrowBack } from 'ionicons/icons'

const route = useRoute()
const router = useRouter()
const nameInput = ref('')
const sexInput = ref('')
const connectionInput = ref('')
const monthInput = ref('')
const dayInput = ref('')

const img = ref('smile.png')
const idPerson = ref(null)

onMounted(() => {
  getPersonData()
})

watch(route, () => {
  getPersonData()
})

const months31 = ['1', '3', '5', '7', '8', '10', '12']
const months30 = ['4', '6', '7', '9']
const days = computed(() => {
  if (months31.find((element) => element == monthInput.value)) {
    return 31
  } else if (months30.find((element) => element == monthInput.value)) {
    return 30
  } else {
    return 29
  }
})

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

async function gravar(atualizar) {
  let obj = {
    name: nameInput.value,
    sex: sexInput.value,
    connection: connectionInput.value,
    month: monthInput.value,
    day: dayInput.value,
    img: img.value,
    id: new Date().getTime(),
  }

  if (atualizar) {
    updateName(obj)
    alerta('atualizar')
  } else {
    createName(obj)
    alerta()
    limpar()
  }
}

async function getPersonData() {
  limpar()
  if (route.params.id) {
    let id = route.params.id
    let pessoa = await searchName(id)

    nameInput.value = pessoa.name
    sexInput.value = pessoa.sex
    connectionInput.value = pessoa.connection
    monthInput.value = pessoa.month * 1
    dayInput.value = pessoa.day * 1
    img.value = pessoa.img
    idPerson.value = pessoa.id
  }
}

function limpar() {
  nameInput.value = ''
  sexInput.value = ''
  connectionInput.value = ''
  monthInput.value = ''
  dayInput.value = ''
  img.value = 'smile.png'
  idPerson.value = null
}

const alerta = async (atualizar) => {
  if (atualizar) {
    const alert = await alertController.create({
      header: 'Parabéns!',

      message: 'Aniversariante atualizado com sucesso!',
      buttons: ['OK'],
    })

    await alert.present()
    await alert.onDidDismiss().then(() => {
      router.push('/home')
    })
  } else {
    const alert = await alertController.create({
      header: 'Parabéns!',

      message: 'Aniversariante cadastrado com sucesso!',
      buttons: ['OK'],
    })

    await alert.present()
    await alert.onDidDismiss().then(() => {
      router.push('/home')
    })
  }
}

function showEmoji() {
  return require('../theme/emoji/' + img.value)
}
</script>
<template>
  <ion-page>
    <ion-content>
      <div
        class="mt-20 mb-10 mx-auto p-2 w-[95%] flex flex-col rounded-xl bg-white drop-shadow-xl"
      >
        <div
          v-if="idPerson"
          class="w-full flex flex-col justify-center items-center mt-2"
        >
          <div
            v-if="sexInput == 'masculino'"
            class="bg-blue-200 w-36 h-32 rounded-full absolute"
          ></div>
          <div v-else class="bg-red-200 w-36 h-32 rounded-full absolute"></div>
          <img
            v-if="sexInput == 'masculino'"
            src="../theme/boy.png"
            alt="Sem foto"
            class="w-36 relative"
          />
          <img
            v-else
            src="../theme/girl.png"
            alt="Sem foto"
            class="w-36 relative"
          />
          <img
            :src="showEmoji()"
            alt=""
            class="w-10 relative bottom-5 -left-12 -rotate-12"
          />
          <h1 class="font-bold text-3xl -mt-5">
            {{ nameInput }}
          </h1>
        </div>
        <div v-else>
          <ion-label class="font-bold">Nome</ion-label>
          <input
            :disabled="idPerson"
            id="name"
            v-model="nameInput"
            type="text"
            class="border border-slate-400 rounded w-full p-2 my-2 outline-none duration-100 focus:drop-shadow-md"
          />
        </div>

        <ion-label class="font-bold">Sexo</ion-label>
        <ion-select
          v-model="sexInput"
          id="sex"
          interface="popover"
          placeholder="Selecione"
          class="border border-slate-400 rounded w-full p-2 my-2"
        >
          <ion-select-option value="masculino">Masculino</ion-select-option>
          <ion-select-option value="feminino">Feminino</ion-select-option>
        </ion-select>
        <ion-label class="font-bold">Tipo de Conexão</ion-label>
        <ion-select
          v-model="connectionInput"
          id="connection"
          interface="popover"
          placeholder="Selecione"
          class="border border-slate-400 rounded w-full p-2 my-2"
        >
          <ion-select-option value="paimae">Pai/Mãe</ion-select-option>
          <ion-select-option value="irmaoirma">Irmão/Irmã</ion-select-option>
          <ion-select-option value="amigoamiga">Amigo(a)</ion-select-option>
          <ion-select-option value="namoradonamroada"
            >Namorado(a)</ion-select-option
          >
          <ion-select-option value="esposoesposa">Esposo(a)</ion-select-option>
          <ion-select-option value="noivonoiva">Noivo(a)</ion-select-option>
          <ion-select-option value="colegadetrabalho"
            >Colega de Trabalho</ion-select-option
          >
          <ion-select-option value="outros">Outro</ion-select-option>
        </ion-select>

        <ion-label class="font-bold">Aniversário</ion-label>
        <div class="flex w-full">
          <div class="w-full">
            <span class="font-bold">Mês:</span>
            <ion-select
              v-model="monthInput"
              id="month"
              interface="popover"
              @ionChange="dayInput = ''"
              placeholder="Selecione"
              class="border border-slate-400 rounded w-full p-2 my-2"
            >
              <ion-select-option
                v-for="(item, index) in months"
                :key="index"
                :value="index + 1"
                >{{ item }}</ion-select-option
              >
            </ion-select>
          </div>
          <div class="w-full mx-1">
            <span class="font-bold">Dia:</span>
            <ion-select
              :disabled="!monthInput"
              v-model="dayInput"
              id="day"
              interface="popover"
              placeholder="Selecione"
              class="border border-slate-400 rounded w-full p-2 my-2"
            >
              <ion-select-option
                v-for="(item, index) in days"
                :key="index"
                :value="item"
                >{{ item }}</ion-select-option
              >
            </ion-select>
          </div>
        </div>
        <ion-list>
          <ion-radio-group
            value="strawberries"
            v-model="img"
            class="flex justify-between"
          >
            <ion-item>
              <img src="../theme/emoji/smile.png" alt="" class="w-5 mr-2" />
              <ion-radio slot="end" value="smile.png"></ion-radio>
            </ion-item>

            <ion-item>
              <img src="../theme/emoji/sunglass.png" alt="" class="w-5 mr-2" />
              <ion-radio slot="end" value="sunglass.png"></ion-radio>
            </ion-item>

            <ion-item>
              <img src="../theme/emoji/heart.png" alt="" class="w-5 mr-2" />
              <ion-radio slot="end" value="heart.png"></ion-radio>
            </ion-item>

            <ion-item>
              <img src="../theme/emoji/crown.png" alt="" class="w-5 mr-2" />
              <ion-radio slot="end" value="crown.png"></ion-radio>
            </ion-item>
          </ion-radio-group>
        </ion-list>

        <ion-button
          v-if="!idPerson"
          class="w-full my-1"
          shape="round"
          @click="gravar()"
          >Adicionar</ion-button
        >
        <ion-button
          v-else
          class="w-full my-1"
          shape="round"
          @click="gravar('atualizar')"
          >Atualizar</ion-button
        >
      </div>
      <ion-fab class="fixed bottom-5 right-5">
        <ion-fab-button @click="router.push('/home')">
          <ion-icon :icon="arrowBack"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>
