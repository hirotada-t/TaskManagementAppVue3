<script setup lang="ts">
import { ref } from 'vue';
// import TaskItem from './TaskItem.vue';
import { useQuasar } from 'quasar';

const props = defineProps({ section: Object, filter: Boolean });
const emits = defineEmits(['add-archive-list']);
const getSection = ref<object>(props.section);
const newCard = ref<string>('');
const newCardInput = ref<boolean>(false);
const $q = useQuasar();

const addSectionInput = () => {
  this.newCardInput = !this.newCardInput;
  this.$nextTick(() => {
    const newSection = document.querySelector('.new-card input');
    newSection.focus();
    newSection.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.addCard();
      }
    });
  });
};
const addCard = () => {
  this.newCardInput = !this.newCardInput;
  const date = new Date();
  getSection.value.cardList.push({
    cardId: 'c-' + date.toLocaleString() + date.getMilliseconds(),
    cardName: this.newCard ? this.newCard : 'Card title',
    // 'cardContent': 'content',
    // 'createDate': date.toLocaleString(),
    // 'deadLine': '',
    // 'checkList': {},
    // 'cardTags': [],
    priority: 'none',
    checked: false,
    archives: false,
    deleted: false,
    // 'cardComment': 'comment',
  });
  this.newCard = '';
};
const archiveSection = () => {
  $q.dialog({
    title: 'Alert',
    message: 'All cards in the section are also archived. Are you sure??',
    cancel: {
      push: true,
      color: 'negative',
    },
  }).onOk(() => {
    getSection.value.archives = true;
    console.log(getSection.value);
    for (let i = 0; i < getSection.value.cardList.length; i++) {
      getSection.value.cardList[i].archives = true;
      emits(['add-archive-list'], {
        cardId: getSection.value.cardList[i].cardId,
        cardName: getSection.value.cardList[i].cardName,
        // 'cardContent': 'content',
        // 'createDate': date.toLocaleString(),
        // 'deadLine': '',
        // 'checkList': {},
        // 'cardTags': [],
        priority: getSection.value.cardList[i].priority,
        checked: getSection.value.cardList[i].checked,
        deleted: false,
        // 'cardComment': 'comment',
      });
    }
  });
};
const addArchive = (e) => {
  emits(['add-archive-list'], e);
};
const countCards = () => {
  let counter = 0;
  for (let i = 0; i < getSection.value.cardList.length; i++) {
    if (!getSection.value.cardList[i].archives) {
      counter++;
    }
  }
  if (counter >= 2) return counter;
};
</script>

<template>
  <div class="q-pa-sm w-300px" v-if="!getSection.archives">
    <q-card class="my-card bg-blue-grey-1">
      <q-card-section>
        <div class="row order-xs-first">
          <q-input
            autogrow
            v-model="getSection.sectionName"
            class="col-11 text-h6"
            placeholder="sectionName"
          >
            <template v-slot:append>
              <q-icon v-if="getSection.sectionName === ''" name="edit" />
              <q-icon
                v-else
                name="clear"
                class="cursor-pointer"
                @click="getSection.sectionName = ''"
              />
            </template>
          </q-input>
          <q-btn flat padding="xs" icon="more_vert" class="col-1">
            <q-menu transition-show="scale" transition-hide="scale">
              <q-list style="min-width: 100px">
                <q-item clickable @click="archiveSection">
                  <q-item-section>archive section</q-item-section>
                </q-item>
                <q-separator />
              </q-list>
            </q-menu>
          </q-btn>
        </div>
        <div class="text-blue-grey-4" v-if="countCards()">
          {{ countCards() }} tasks remain.
        </div>
      </q-card-section>
      <q-card-section class="h-full q-py-none">
        <div v-for="card of getSection.cardList" :key="card.cardId">
          <TaskItem
            :card="card"
            :filtered="filter"
            @add-archive="addArchive"
          ></TaskItem>
        </div>
        <q-card class="my-card q-mb-md" v-if="newCardInput">
          <q-card-section class="q-py-none q-px-sm card-name text-h6">
            <q-input
              borderless
              class="new-card"
              v-model="newCard"
              placeholder="cardName"
            />
            <q-btn
              label="add"
              color="primary"
              @click="addCard"
              class="q-my-sm"
            />
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-btn
        flat
        class="full-width q-py-sm bg-dark text-white"
        label="＋ add card"
        @click="addSectionInput"
      />
    </q-card>
  </div>
</template>

<style lang="scss" scoped>
.w-300px {
  width: 300px;
}

.h-full {
  @media screen and (min-width: 1024px) {
    max-height: calc(100vh - 270px);
  }

  margin-right: 5px;
  max-height: calc(100vh - 290px);
  overflow-x: auto;
}

.zoom-out .h-full {
  max-height: calc(200vh - 430px);
}

.h-full::-webkit-scrollbar {
  width: 7px;
}

.h-full::-webkit-scrollbar-track {
  background-color: #55555540;
  border-radius: 100px;
  margin-bottom: 10px;
}

.h-full::-webkit-scrollbar-thumb {
  border-radius: 100px;
  background-color: #55555580;
}
</style>
