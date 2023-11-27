import { ref } from 'vue';

export function useModal() {
    const isModalVisible = ref(false);

    const openModal = () => {
        isModalVisible.value = true;
    };

    const closeModal = () => {
        console.log('Fermeture');
        isModalVisible.value = false;
        console.log(isModalVisible.value);
    };

    return { isModalVisible, openModal, closeModal };
}
