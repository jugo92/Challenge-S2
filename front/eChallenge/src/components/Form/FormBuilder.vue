<template>
  <div class="mx-auto w-full mt-4 p-6 bg-gray-100 rounded-md">
    <form>
      <div v-for="(field, index) in formFields" :key="index" class="mb-4">
        <template v-if="field.type !== 'button'">
          <!-- Label -->
          <template v-if="field.type === 'label' && showField(field)">
            <label :for="field.name" class="block text-gray-700 text-sm mb-2">
              <b>{{ field.label }}</b>&nbsp; {{ field.value }} €
            </label>
          </template>
          <template v-else-if="showField(field)">
            <label :for="field.name" class="block text-gray-700 text-sm font-bold mb-2">{{ field.label }} <span class="text-red-600" v-if="field.required">*</span></label>
          </template>

          <!-- Input Text -->
          <template v-if="(field.type === 'text' || field.type === 'email' || field.type === 'number') && showField(field)">
            <input
                :type="field.type"
                :id="field.name"
                :name="field.name"
                v-model="field.value"
                @input="callChangeHandlers(field.changeHandlers); handleInput(field)"
                :required="field.required"
                :placeholder="field.placeholder"
                :min="field.min"
                :max="field.max"
                class="form form-input-text"
            />
          </template>

          <!-- Input File -->
          <template v-else-if="field.type === 'file' && showField(field)">
              <input type="file" multiple  ref="fileInput" @change="handleFileChange" class="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary" />
              <div class="mt-4">
                <div v-for="file in files" :key="file.name" class="inline-block mr-4">
                  <img :src="getFileUrl(file)" class="w-32 h-32 object-cover" />
                </div>
              </div>
          </template>

          <!-- Select Static -->
          <template v-else-if="field.type === 'select' && field.optionsType === 'static' && showField(field)">
            <select
                :id="field.name"
                :name="field.name"
                v-model="field.value"
                @change="callChangeHandlers(field.changeHandlers)"
                class="form form-input-select"
            >
              <option value=""  selected>Sélectionnez un(e) {{ field.label.toLowerCase() }}</option>
              <option v-for="(option, optionIndex) in field.options" :key="optionIndex" :value="option.id">
                {{ option.name }}
              </option>
            </select>
          </template>

          <!-- Select Dynamic -->
          <template v-else-if="field.type === 'select' && field.optionsType === 'dynamic' && showField(field)">
            <select :id="field.name" :name="field.name" v-model="field.value"
                    @change="callChangeHandlers(field.changeHandlers)"
                    class="form form-input-select">
              <option value="" selected>Sélectionnez un(e) {{ field.label.toLowerCase() }}</option>
              <option v-for="(option, optionIndex) in field.options" :key="optionIndex" :value="option[field.valueKey]">
                {{ option[field.labelKey] }}
              </option>
            </select>
          </template>

          <!-- Search -->
          <template v-else-if="field.type === 'search'">
            <input
                :type="field.type"
                :id="field.name"
                :name="field.name"
                v-model="field.value"
                @input="callChangeHandlers(field.changeHandlers)"
                @change="callChangeHandlers(field.changeHandlers)"
                @click="callChangeHandlers(field.changeHandlers)"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                :placeholder="field.placeholder"
            />
            <div v-if="field.suggestions.length > 0" class="suggestions">
              <div v-for="(suggestion, index) in field.suggestions" :key="index" @click="selectSuggestion(field, suggestion); callChangeHandlers(field.changeHandlers)">
                {{ suggestion.name }}
              </div>
            </div>
          </template>

          <!-- Textarea -->
          <template v-else-if="field.type === 'textarea' && showField(field)" @input="callChangeHandlers(field.changeHandlers)">
            <textarea :id="field.name" :name="field.name" v-model="field.value" :required="field.required" :placeholder="field.placeholder" rows="5"
                      class="form form-input-textarea"></textarea>
          </template>

          <!-- Checkbox -->
          <template v-else-if="field.type === 'checkbox' && showField(field)">
            <input :type="field.type" :id="field.name" :name="field.name" v-model="field.isChecked" class="mr-2 leading-tight">
            <label :for="field.name" class="text-sm">{{ field.label }}</label>
          </template>

          <!-- Error message -->
          <div class="text-red-600" v-if="field.validationError">{{ field.validationError.message }}</div>
        </template>
      </div>

      <!-- Buttons -->
      <template v-for="(button, buttonIndex) in formFields" :key="buttonIndex" class="w-full">
        <button
            v-if="button.type === 'button' && showField(button)"
            :type="button.buttonType"
            :class="button.buttonClass"
            @click.prevent="button.buttonClick()"
            class="mr-2"
        >
          {{ button.label }}
        </button>
      </template>
    </form>
  </div>
</template>

<script setup lang="ts">

import {useForm} from "./formHelper.ts";

const {showField, callChangeHandlers, handleInput, selectSuggestion, getFileUrl, handleFileChange, files} = useForm();
const props = defineProps(["formFields", "format", "modelValue"]);

</script>

<style scoped lang="scss">
@import "./../../assets/styles.css";

.suggestions {
  position: absolute;
  background-color: white;
  border: 1px solid #e0e0e0;
  max-height: 150px;
  overflow-y: auto;
  z-index: 1;
}
.suggestions div {
  padding: 8px;
  width: 155px;
  cursor: pointer;
}
.suggestions div:hover {
  background-color: #eaeaea;
}
</style>
