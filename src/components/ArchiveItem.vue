<script setup lang="ts"></script>

<template>
  <q-card
    class="gnavi my-card q-my-md q-mx-auto"
    :class="archiveItem.priority"
    v-if="!deleted"
  >
    <div class="cleared-border" :class="archiveItem.checked ? 'cleared' : ''">
      <div>
        <q-card-section
          class="row justify-between q-py-none q-px-sm card-name text-h6"
        >
          {{ archiveItem.cardName }}
          <q-btn flat icon="delete" @click="deleteAlert" />
        </q-card-section>
        <q-card-section
          class="row justify-start items-center q-py-none q-px-sm card-name"
        >
          <div class="col-3">
            <q-checkbox disable :value="archiveItem.checked" color="black" />
            <q-tooltip v-if="archiveItem.checked"> Cleared! </q-tooltip>
            <q-tooltip v-if="!archiveItem.checked"> Not cleared </q-tooltip>
          </div>
          <div class="col-6 q-py-sm">
            <q-input
              disable
              dense
              borderless
              :value="archiveItem.priority"
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
</style>
