<script setup lang="ts">
import FormBuilder from "../Form/FormBuilder.vue";
import Button from "../Button.vue";

const props = defineProps(["title", "content", "formConfig", "show"]);
const emit = defineEmits();

const closeModal = () => {
    emit("close");
};
</script>

<template>
    <div>
        <!-- Overlay -->
        <div v-if="show" class="overlay" @click="closeModal"></div>
        <!-- Modal -->
        <div v-if="show" id="default-modal" tabindex="-1" aria-hidden="true" class="ab overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-1 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div class="m-auto p-4 w-full max-w-2xl max-h-full">
                <!-- Modal content -->
                <div class="bg-white rounded-lg shadow">
                    <!-- Modal header -->
                    <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                            {{ props.title }}
                        </h3>
                        <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal" @click="closeModal">
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span class="sr-only">Close modal</span>
                        </button>
                    </div>
                    <!-- Modal body -->
                    <div class="p-4 md:p-5 space-y-4" v-if="content=='modalCreateProduct'">
                      <FormBuilder :formFields="formConfig" format="column"/>
                      {{console.log(formConfig)}}
                    </div>
                    <!-- Modal footer -->
                    <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <!--                        affiche les boutons de formConfig avec le tag button-->
                        <span v-for="field in formConfig">

                            <Button
                                action=""
                                name=""
                                :redirect=false
                                v-if="field.tag === 'button'"
                                :content="field.content"
                                :color="field.color"
                                @click="field.action"
                            />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Fond gris avec une transparence de 50% */
    z-index: 0; /* Doit être inférieur au z-index de la modal pour le recouvrir */
}

/* Autres styles pour la modal ici */
</style>
