<script setup lang="ts">
import { ref, inject } from 'vue';
import { useQuasar } from 'quasar';
import { ArchiveCard, Card } from 'src/models';

const $q = useQuasar();
const props = defineProps<{ card: Card }>();
const emits = defineEmits<{ (e: 'add-archive', card: ArchiveCard): void }>();

const getCard = ref<Card>(props.card);
const options = ['none', 'high', 'middle', 'low'];
const filtered = inject('filtered');

const archiveCard = () => {
  let message = '';
  if (!getCard.value.cleared) {
    message = 'The task is uncompleted. Do you archive?';
  } else {
    message = 'Do you archive the task?';
  }
  $q.dialog({
    title: 'Alert',
    message,
    cancel: {
      push: true,
      color: 'negative',
    },
  }).onOk(() => {
    getCard.value.archives = true;
    emits('add-archive', {
      cardId: getCard.value.cardId,
      cardName: getCard.value.cardName,
      priority: getCard.value.priority,
      cleared: getCard.value.cleared,
      deleted: false,
    });
  });
};
</script>

<template>
  <q-card
    class="gnavi my-card q-mb-md"
    v-if="!getCard.archives"
    v-show="!(filtered && getCard.cleared)"
    :class="getCard.priority"
  >
    <div class="cleared-border" :class="getCard.cleared ? 'cleared' : ''">
      <div>
        <q-card-section class="q-py-none q-px-sm card-name">
          <q-input
            dense
            autogrow
            v-model="getCard.cardName"
            class="col-11 text-h6"
            placeholder="cardName"
          >
            <template v-slot:append>
              <q-icon v-if="getCard.cardName === ''" name="edit" />
              <q-icon
                v-else
                name="clear"
                class="cursor-pointer"
                @click="getCard.cardName = ''"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-card-section class="row justify-start q-py-none card-name">
          <div class="">
            <q-checkbox v-model="getCard.cleared" color="black" />
            <q-tooltip v-if="getCard.cleared"> Cleared! </q-tooltip>
            <q-tooltip v-if="!getCard.cleared"> Not cleared </q-tooltip>
          </div>
          <div class="">
            <q-btn round flat @click="archiveCard" icon="archive" />
            <q-tooltip> Archive </q-tooltip>
          </div>
          <div class="col-7 q-py-sm">
            <q-select
              dense
              filled
              borderless
              v-model="getCard.priority"
              :options="options"
              label="priority"
            />
          </div>
        </q-card-section>
      </div>
    </div>
  </q-card>
</template>

<style lang="scss" scoped>
.my-card {
  width: 100%;
  max-width: 250px;
}

.high {
  background-color: #ff7f7f;
}

.middle {
  background-color: #ffff7f;
}

.low {
  background-color: #7fffbf;
}

.gnavi .cleared-border {
  position: relative;
}

.gnavi .cleared-border::before,
.gnavi .cleared-border::after {
  content: '';
  position: absolute;
  width: 0;
  height: 3px;
  background-color: #fc693b;
  background-image: repeating-linear-gradient(
    -45deg,
    #fff,
    #fff 7px,
    transparent 0,
    transparent 14px
  );
  transition: all 0.2s linear;
  transition-delay: 0.2s;
}

.gnavi .cleared-border::before {
  right: 0;
  top: 0;
}

.gnavi .cleared-border::after {
  left: 0;
  bottom: 0;
}

.gnavi .cleared-border div::before,
.gnavi .cleared-border div::after {
  content: '';
  position: absolute;
  width: 3px;
  height: 0;
  background-color: #fc693b;
  background-image: repeating-linear-gradient(
    -45deg,
    #fff,
    #fff 7px,
    transparent 0,
    transparent 14px
  );
  transition: all 0.2s linear;
}

.gnavi .cleared-border div::before {
  left: 0;
  top: 0;
}

.gnavi .cleared-border div::after {
  right: 0;
  bottom: 0;
}

.gnavi .cleared::before,
.gnavi .cleared::after {
  width: 100%;
}

.gnavi .cleared div::before,
.gnavi .cleared div::after {
  height: 100%;
}

.sp-none {
  @media screen and (max-width: 599px) {
    display: none;
  }
}

.tb-pc-none {
  @media screen and (min-width: 600px) {
    display: none;
  }
}
</style>
