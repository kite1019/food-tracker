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
          <date-picker v-model:value="form.date" format="YYYY-MM-DD" value-type="format" input-class="form-control" placeholder="選擇日期"></date-picker>
        </div>
      </div>
      <div class="row g-3 align-items-center mb-2">
        <div class="col-auto align-self-start">
          <label class="col-form-label">餐別：</label>
        </div>
        <div class="col-auto">
          <div class="btn-group meal-btn-group" role="group">
            <button type="button" class="btn meal-btn" :class="form.mealType === '早餐' ? 'btn-primary' : 'btn-outline-primary'" @click="setMealType('早餐')">
              <i class="fa-solid fa-sun me-1"></i> 早餐
            </button>
            <button type="button" class="btn meal-btn" :class="form.mealType === '午餐' ? 'btn-primary' : 'btn-outline-primary'" @click="setMealType('午餐')">
              <i class="fa-solid fa-burger me-1"></i> 午餐
            </button>
            <button type="button" class="btn meal-btn" :class="form.mealType === '晚餐' ? 'btn-primary' : 'btn-outline-primary'" @click="setMealType('晚餐')">
              <i class="fa-solid fa-moon me-1"></i> 晚餐
            </button>
            <button type="button" class="btn meal-btn" :class="form.mealType === '其他' ? 'btn-primary' : 'btn-outline-primary'" @click="setMealType('其他')">
              <i class="fa-solid fa-cookie-bite me-1"></i> 其他
            </button>
          </div>
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
      <button type="submit" class="btn btn-primary me-2">{{ editId === null ? '新增' : '更新' }}</button>
      <button v-if="editId !== null" type="button" @click="cancelEdit" class="btn btn-secondary">取消</button>
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
import { ref, onMounted } from 'vue'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'
import { db } from '../firebase'
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore'

const records = ref([])
const form = ref({ date: getTodayDate(), mealType: '早餐', food: '', calories: '' })
const editId = ref(null)
const foodCollection = collection(db, 'foodRecords')

// 讀取 Firestore 資料
async function fetchRecords() {
  const querySnapshot = await getDocs(foodCollection)
  records.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

onMounted(fetchRecords)

// 設定餐別
function setMealType(type) {
  form.value.mealType = type
}

// 新增或更新
async function handleSubmit() {
  if (editId.value === null) {
    // 新增
    await addDoc(foodCollection, { ...form.value, calories: Number(form.value.calories) })
  } else {
    // 更新
    const recordRef = doc(db, 'foodRecords', editId.value)
    await updateDoc(recordRef, { ...form.value, calories: Number(form.value.calories) })
  }
  await fetchRecords()
  resetForm()
}

function editRecord(idx) {
  const record = records.value[idx]
  form.value = { date: record.date, mealType: record.mealType, food: record.food, calories: record.calories }
  editId.value = record.id
}

async function deleteRecord(idx) {
  const record = records.value[idx]
  const recordRef = doc(db, 'foodRecords', record.id)
  await deleteDoc(recordRef)
  await fetchRecords()
  reseorm()
}

function cancelEdit() {
  resetForm()
}

function resetForm() {
  form.value = { date: getTodayDate(), mealType: '早餐', food: '', calories: '' }
  editId.value = null
}

function getTodayDate() {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  const local = new Date(now.getTime() - offset * 60000)
  return local.toISOString().slice(0, 10)
}
</script>

<style>
/* 覆寫 datepicker 樣式以符合專案 */
.mx-datepicker {
  width: auto;
}
.meal-btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-width: 320px;
}
.meal-btn-group .btn {
  flex: 1 1 40%;
  min-width: 120px;
}
@media (max-width: 600px) {
  .meal-btn-group {
    max-width: 260px;
    gap: 0.5rem 0.5rem;
  }
  .meal-btn-group .btn {
    flex: 1 1 45%;
    min-width: 100px;
    margin-bottom: 0.5rem;
  }
  .meal-btn-group .btn:nth-child(3),
  .meal-btn-group .btn:nth-child(4) {
    margin-top: 0;
  }
  .meal-btn-group .btn:nth-child(3) {
    margin-left: 0;
    padding-left: 0;
  }
  .meal-btn-group .btn:nth-child(4) {
    margin-left: 0.5rem;
  }
}
.meal-btn {
  border-radius: 0.3rem !important;
}
input.form-control,
select.form-select,
.date-picker input.form-control,
.mx-input,
.date-picker .mx-input {
  border-radius: 0.3rem !important;
}
.btn,
.btn-group .btn {
  border-radius: 0.3rem !important;
}
</style> 