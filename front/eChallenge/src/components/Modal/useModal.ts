import { ref } from 'vue';

export function useModal() {
    const isModalVisible = ref(false);

    const openModal = () => {
        isModalVisible.value = true;
    };

    const closeModal = () => {
        isModalVisible.value = false;
    };

    return { isModalVisible, openModal, closeModal };
}
