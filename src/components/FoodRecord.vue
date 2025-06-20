<template>
  <div>
    <h2>每日飲食紀錄</h2>
    <!-- 新增/編輯表單 -->
    <form @submit.prevent="handleSubmit" class="mb-4">
      <div class="row g-3 align-items-center mb-2">
        <div class="col-auto">
          <label class="col-form-label">日期：</label>
        </div>
        <div class="col-auto">
          <input type="date" v-model="form.date" required class="form-control" />
        </div>
        <div class="col-auto">
          <span class="form-text text-muted">(修改時可調整)</span>
        </div>
      </div>
      <div class="row g-3 align-items-center mb-2">
        <div class="col-auto">
          <label class="col-form-label">餐別：</label>
        </div>
        <div class="col-auto">
          <select v-model="form.mealType" required class="form-select">
            <option value="早餐">早餐</option>
            <option value="午餐">午餐</option>
            <option value="晚餐">晚餐</option>
            <option value="其他">其他</option>
          </select>
        </div>
      </div>
      <div class="row g-3 align-items-center mb-2">
        <div class="col-auto">
          <label class="col-form-label">食物：</label>
        </div>
        <div class="col-auto">
          <input type="text" v-model="form.food" required class="form-control" />
        </div>
      </div>
      <div class="row g-3 align-items-center mb-3">
        <div class="col-auto">
          <label class="col-form-label">熱量：</label>
        </div>
        <div class="col-auto">
          <input type="number" v-model="form.calories" required min="1" step="1" class="form-control" pattern="[0-9]*" inputmode="numeric" placeholder="請輸入數字" />
        </div>
        <div class="col-auto">
          <span class="form-text">(大卡)</span>
        </div>
      </div>
      <button type="submit" class="btn btn-primary me-2">{{ editIndex === null ? '新增' : '更新' }}</button>
      <button v-if="editIndex !== null" type="button" @click="cancelEdit" class="btn btn-secondary">取消</button>
    </form>
    <hr />
    <!-- 紀錄列表 -->
    <table class="table table-bordered table-striped">
      <thead class="table-light">
        <tr>
          <th>日期</th>
          <th>餐別</th>
          <th>食物</th>
          <th>熱量</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(record, idx) in records" :key="idx">
          <td>{{ record.date }}</td>
          <td>{{ record.mealType }}</td>
          <td>{{ record.food }}</td>
          <td>{{ record.calories }}</td>
          <td>
            <button @click="editRecord(idx)" class="btn btn-sm btn-warning me-1">編輯</button>
            <button @click="deleteRecord(idx)" class="btn btn-sm btn-danger">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const records = ref([])
const form = ref({ date: getTodayDate(), mealType: '早餐', food: '', calories: '' })
const editIndex = ref(null)

function handleSubmit() {
  if (editIndex.value === null) {
    if (!form.value.date) {
      form.value.date = getTodayDate()
    }
    records.value.push({ ...form.value })
  } else {
    records.value[editIndex.value] = { ...form.value }
  }
  resetForm()
}

function editRecord(idx) {
  form.value = { ...records.value[idx] }
  editIndex.value = idx
}

function deleteRecord(idx) {
  records.value.splice(idx, 1)
  resetForm()
}

function cancelEdit() {
  resetForm()
}

function resetForm() {
  form.value = { date: getTodayDate(), mealType: '早餐', food: '', calories: '' }
  editIndex.value = null
}

function getTodayDate() {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  const local = new Date(now.getTime() - offset * 60000)
  return local.toISOString().slice(0, 10)
}
</script>

<style scoped>
/* 可視需要自訂額外樣式 */
</style> 