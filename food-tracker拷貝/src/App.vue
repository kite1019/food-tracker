<script setup>
import FoodRecord from './components/FoodRecord.vue'
import FoodCalendar from './components/FoodCalendar.vue'
import FoodStats from './components/FoodStats.vue'
</script>

<template>
  <div>
    <h1>每日飲食追蹤器</h1>
    <FoodRecord />
    <FoodCalendar />
    <FoodStats />
  </div>
</template>

<style scoped>
h1 { margin-bottom: 2em; }
</style>
