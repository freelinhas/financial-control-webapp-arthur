import { ref } from 'vue'
import { categoryService } from '../services/category.service';

export const useCategories = () => {
  const categories = ref([]);

  const loadCategories = async () => {
    const [categoryData] = await Promise.all([
      categoryService.getCategoriesWithTotal()
    ]);

    categories.value = categoryData;
  }

  return { categories, loadCategories };
}
