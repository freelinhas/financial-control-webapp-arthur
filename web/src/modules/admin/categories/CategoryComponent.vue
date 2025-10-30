<template>
  <v-form @submit.prevent="handleSubmit" ref="formRef" v-model="formIsValid">
    <v-text-field
      v-model="form.name"
      label="Nome da categoria"
      :rules="[rules.required]"
    />

    <v-select
      v-model="form.type"
      :items="['ENTRY', 'EXIT']"
      label="Tipo"
      :rules="[rules.required]"
    />

    <v-btn type="submit" color="primary" :disabled="!formIsValid">
      {{ isEdit ? 'Atualizar' : 'Criar' }} Categoria
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch, toRefs } from 'vue';
import { categoryService } from '@/modules/home/services/category.service';

const props = defineProps<{
  categoryId?: number
  onSuccess?: () => void
}>()

const form = reactive({
  name: '',
  type: 'ENTRY' as 'ENTRY' | 'EXIT',
})
const formRef = ref()
const formIsValid = ref(false)
const isEdit = ref(false)

const rules = {
  required: (v: string) => !!v || 'Campo obrigatório'
}

const loadCategory = async () => {
  if (!props.categoryId) return
  // const category = await getCategory(props.categoryId)
  // form.name = category.name
  // form.type = category.type
  isEdit.value = true
}

const handleSubmit = async () => {
  if (!formRef.value?.validate()) return

  if (isEdit.value && props.categoryId) {
    await categoryService.updateCategory(props.categoryId, form)
  } else {
    await categoryService.createCategory(form)
  }

  props.onSuccess?.()
}

watch(() => props.categoryId, loadCategory, { immediate: true })
</script>

<style scoped>
.v-form {
  max-width: 400px;
}
</style>