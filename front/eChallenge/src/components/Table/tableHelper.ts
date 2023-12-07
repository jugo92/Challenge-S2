export const unselectAllItems = () => {
    const checkboxes = document.querySelectorAll('.table-input-checkbox');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });
    selectedItems.value = [];
};