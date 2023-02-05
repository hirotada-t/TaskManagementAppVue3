<script setup lang="ts">
const tasks = JSON.parse(localStorage.getItem('tasks'));
console.log(tasks);
</script>

<template>
  <q-page> task </q-page>
</template>
