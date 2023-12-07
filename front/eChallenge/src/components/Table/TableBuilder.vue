<template>
  <FormBuilder :formFields="actionsConfig" format="column"/>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg z-1">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
      <thead class="text-xs text-gray-700 uppercase bg-gray-100">
      <tr>
        <th scope="col" class="p-4">
          <div class="flex items-center">
            <input id="all-item" type="checkbox" class="table table-input-checkbox" @change="selectAll">
          </div>
        </th>
        <th v-for="column in columns" :key="column.key" scope="col" class="px-5 py-3">
          <span class="flex justify-between">
            {{ column.label }} <Icon icon="fa6-solid:sort" v-if="column.filter" @click="sortByColumn(column.key)" class="hover:cursor-pointer"/>
          </span>
          <input v-if="column.filter" v-model="filters[column.key]" class="table table-input-text"/>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr class="bg-white hover:bg-gray-50" v-for="row in sortedData" :key="row.id">
        <td class="w-4 p-4">
          <div class="flex items-center">
            <input :id="row._id" type="checkbox" class="table table-input-checkbox" :v-model="'item_' + row._id" @change="getSelectedInstances">
          </div>
        </td>
        <td v-for="(value, _ , index) in Object.entries(row).slice(1)" :key="index" :class="{[columnsStyleObject[value[0]]] : columnsStyleObject.hasOwnProperty(value[0]) }">
          <p class="text-center">
            {{ value[1] == "undefined" || value[1] == "" ? "-" : value[1] }}
          </p>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
  <nav class="pagination" aria-label="Table navigation">
    <span class="text-sm font-normal text-gray-500 mb-4 md:mb-0 block w-full md:inline md:w-auto">Afficher <span class="font-semibold text-gray-900 dark:text-white">1-10</span> sur <span class="font-semibold text-gray-900 dark:text-white">1000</span></span>
    <ul class="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
      <li>
        <a href="#" class="pagination-previous">Précédent</a>
      </li>
      <li>
        <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">1</a>
      </li>
      <li>
        <a href="#" class="pagination-next">Suivant</a>
      </li>
    </ul>
  </nav>

</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {Icon} from "@iconify/vue";
import FormBuilder from "../Form/FormBuilder.vue";
const emit = defineEmits();

const props = defineProps(['columns', 'data', 'formConfig']);

const filters = ref<Record<string, string>>({});
const sortColumn = ref<string | null>(null);
const sortDirection = ref<'asc' | 'desc'>('asc');

const columnsWithStyle = props.columns.filter(column => column.style);
const columnsStyleObject = columnsWithStyle.reduce((acc, column) => {
  acc[column.key] = column.style;
  return acc;
}, {});

const currentPath = window.location.pathname;
const instance = currentPath.substring(currentPath.lastIndexOf('/') + 1);

const filteredData = computed(() => {
  let filteredData = [...props.data];
  for (const key in filters.value) {
    if (filters.value[key]) {
      filteredData = filteredData.filter((row) =>
          String(row[key]).toLowerCase().includes(filters.value[key].toLowerCase())
      );
    }
  }
  return filteredData;
});

const sortedData = computed(() => {
  const key = sortColumn.value;
  const direction = sortDirection.value;

  if (key) {
    return filteredData.value.sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (aValue === bValue) {
        return 0;
      }

      if (direction === 'asc') {
        return aValue < bValue ? -1 : 1;
      } else {
        return aValue > bValue ? -1 : 1;
      }
    });
  } else {
    return filteredData.value;
  }
});

const selectedItems:any = ref([]);

const getSelectedInstances = () => {
    selectedItems.value = [];
    const checkboxes = document.querySelectorAll('.table-input-checkbox');
    checkboxes.forEach((checkbox:any) => {
        if (checkbox.checked) {
            selectedItems.value.push(checkbox.id);
        }
    });
    console.log("getselectedinstances", selectedItems)
    return selectedItems.value;
};


const selectAll = () => {
  const allItem:any = document.getElementById('all-item');
  if (allItem.checked) {
    selectAllItems();
  } else {
    unselectAllItems();
  }
  console.log(selectedItems.value);
};

const selectAllItems = () => {
  selectedItems.value = [];
  const checkboxes = document.querySelectorAll('.table-input-checkbox');
  checkboxes.forEach((checkbox:any) => {
    checkbox.checked = true;
    selectedItems.value.push(checkbox.id);
  });
};

const unselectAllItems = () => {
  const checkboxes = document.querySelectorAll('.table-input-checkbox');
  checkboxes.forEach((checkbox:any) => {
    checkbox.checked = false;
  });
  selectedItems.value = [];
};

// const deleteSelectedItems = () => {
//     console.log("deleteSelectedItems" ,selectedItems.value)
//   if (confirm('Voulez-vous vraiment supprimer les produits sélectionnés ?')) {
//     forEach(selectedItems.value, (item) => {
//         apiService.delete(instance, selectedItems.value)
//     });
//   }
// };

const sortByColumn = (columnKey: string) => {
  if (sortColumn.value === columnKey) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = columnKey;
    sortDirection.value = 'asc';
  }
};

const actionsConfig = ref([
  {
    type: 'button',
    label: 'Créer',
    buttonType: 'button',
    buttonClass: 'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
    buttonClick: () => {
      emit('open', instance, false);
    },
    showCondition: () => true
  },
  {
    type: 'button',
    label: 'Modifier',
    buttonType: 'button',
    buttonClass: 'bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
    buttonClick: () => {
      emit('open', instance, true, selectedItems.value);
    },
    showCondition: () => selectedItems.value.length === 1
  },
  {
    type: 'button',
    label: 'Supprimer',
    buttonType: 'button',
    buttonClass: 'bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
    buttonClick: () => {
        emit('open', instance, null, getSelectedInstances());
    },
    showCondition: () => selectedItems.value.length > 0
  }
])
</script>

<style scoped lang="scss">
@tailwind base;
@tailwind components;
@tailwind utilities;
@import "./../../assets/styles.css";

</style>
