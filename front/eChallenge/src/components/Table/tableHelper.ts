import {reactive, ref} from "vue";

export function useTable() {

    const tableData = ref([])
    const unselectAllItems = () => {
        const checkboxes = document.querySelectorAll('.table-input-checkbox');
        checkboxes.forEach((checkbox) => {
            checkbox.checked = false;
        });
        selectedItems.value = [];
    };

    const getTableColumns = (instance) => {
        switch (instance){
            case 'products':
                return [
                    { key: 'name', label: 'Nom', filter: true, style: 'font-bold underline', link: 'products'},
                    { key: 'Category.name', label: 'Catégorie', filter: true },
                    { key: 'Marque.name', label: 'Marque', filter: true },
                    { key: 'price', label: 'Prix', filter: true },
                    { key: 'quantity', label: 'Quantité', filter: true },
                    { key: 'state', label: 'État', filter: true },
                    { key: 'promotion', label: 'Promotion', filter: true },
                    { key: 'isPublished', label: 'Est Publié', filter: true },
                ];
            case 'brands':
                return [
                    { key: 'name', label: 'Nom', filter: true, style: 'font-bold' },
                    { key: 'description', label: 'Description', filter: true, },
                    { key: 'image', label: 'Image', filter: true },
                ];
            case 'categories':
                return [
                    { key: 'name', label: 'Nom', filter: true, style: 'font-bold' },
                    { key: 'description', label: 'Description', filter: true },
                ];
            case 'users':
                return [
                    { key: 'firstname+lastname', label: 'Nom Prénom', filter: true, style: 'font-bold underline', link: 'users' },
                    { key: 'email', label: 'Email', filter: true },
                    { key: 'role', label: 'Rôle', filter: true },
                    { key: 'isVerified', label: 'Est vérifié', filter: true },
                    { key: 'isActive', label: 'Est actif', filter: true },
                    { key: 'createdAt', label: 'Créé le', filter: true },
                    { key: 'updatedAt', label: 'Mis à jour le', filter: true },
                ];
            case 'refundsAdmin':
                return [
                    { key: 'UserId', label: 'Nom Prénom', filter: true },
                    { key: 'motif', label: 'Motif', filter: true },
                    { key: 'amount_refund', label: 'Montant', filter: true },
                    { key: 'accepted', label: 'Accepté', filter: true },
                    { key: 'createdAt', label: 'Créé le', filter: true },
                ]
            case 'refunds':
                return [
                    { key: 'OrderId', label: 'N° de commande', filter: true },
                    { key: 'motif', label: 'Motif', filter: true },
                    { key: 'amount_refund', label: 'Montant', filter: true },
                    { key: 'accepted', label: 'Accepté', filter: true },
                    { key: 'createdAt', label: 'Créé le', filter: true },
                ]
            default:
                return;
        }
    };

    const getIncludedProperties = (instance) => {
        switch (instance) {
            case 'products':
                return ['_id', 'name', 'Category.name', 'Marque.name', 'price', 'quantity', 'state', 'promotion', 'isPublished', 'quantity_alert'];
            case 'brands':
                return ['id', 'name', 'description', 'image'];
            case 'categories':
                return ['id', 'name', 'description'];
            case 'users':
                return ['id', 'firstname+lastname', 'email', 'role', 'isVerified', 'isActive', 'createdAt', 'updatedAt'];
            case 'refunds':
                return ['id', 'OrderId', 'motif', 'amount_refund', 'accepted', 'createdAt'];
            default:
                return;
        }
    };

    const fetchListOfItems = async (instance, paramsSupp) => {
        const includedProperties = getIncludedProperties(instance);
        let url = 'http://localhost:3000/api/' + instance + "?page=" + pageIndex.currentPage + "&limit=" + pageIndex.limit;
        if(paramsSupp){
            url += "&" + paramsSupp;
        }
        try {
            const response = await fetch(url);
            const data = await response.json();
            tableData.value = data.map((item) => {
                const filteredItem = {};
                for (const property of includedProperties) {
                    if(property.includes('.')){
                        if(item.hasOwnProperty(property.split('.')[0])){
                            filteredItem[property] = item[property.split('.')[0]][property.split('.')[1]]
                        }
                    }else if(property.includes('+')) {
                        if (item.hasOwnProperty(property.split('+')[0])) {
                            filteredItem[property] = item[property.split('+')[0]] + ' ' + item[property.split('+')[1]]
                        }
                    }
                    else  {
                        filteredItem[property] = item[property] || '';
                    }
                }
                return filteredItem;
            });
            console.log("refund", tableData.value);
        } catch (error) {
            console.error('Erreur lors de la récupération des produits depuis l\'API', error);
        }
    };

    const pageIndex = reactive({
        limit: 10,
        currentPage: 1,
    })

    const afterInstanceSave = (instance, paramsSupp) => {
        isModalVisible.value = false;
        setTimeout(() => {
            fetchListOfItems(instance, paramsSupp);
        }, 500);
    }

    return {tableData, getTableColumns, fetchListOfItems, pageIndex, unselectAllItems, afterInstanceSave, getIncludedProperties};
}
