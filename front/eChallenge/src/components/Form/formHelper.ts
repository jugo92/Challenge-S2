import { z } from "zod";
import {apiService} from "../../services/apiService.ts";
import {inject, provide, ref} from "vue";
import {forEach} from "lodash";
interface FormField {
    label: string;
    type: 'text' | 'textarea' | 'select' | 'number' | 'label' | 'button' | 'search' | 'checkbox' | 'email' | 'file';
    name: string;
    value?: string | number;
    valueId?: string | number;
    placeholder?: string;
    min?: number;
    max?: number;
    multiple?: boolean;
    required?: boolean;
    isChecked?: boolean;
    suggestions?: any[];
    showCondition?: () => boolean;
    optionsType?: 'static' | 'dynamic';
    options?: any[];
    labelKey?: string;
    valueKey?: string;
    changeHandlers?: (() => void)[];
    readonly?: boolean;
    buttonType?: 'button' | 'submit';
    buttonClass?: string;
    buttonClick?: () => void;
    validationSchema?: z.ZodTypeAny;
    validationError: { message: string } | null;
}

export function useForm(formConfig: FormField[]) {
    const instance = inject('instance');
    const listFormData = ref([]);
    const showField = (field: FormField) => {
        return !field.showCondition || (field.showCondition && field.showCondition());
    };

    const reinitForm = (formConfig) => {

        const fieldsToReset = formConfig.value.filter(field => field.type !== 'button').map(field => field.name);

        formConfig.value
            .filter(field => field.type !== 'button' && field.validationError != null)
            // .forEach(field => {
                // this.$nextTick(() => {
                //     field.validationError = '';
                // });
            // });

        fieldsToReset.forEach(fieldName => {
            const field = formConfig.value.find(field => field.name === fieldName);

            if (field) {
                switch (field.type) {
                    case 'number':
                        field.value = 0;
                        break;
                    case 'search':
                        field.value = '';
                        field.valueId = '';
                        break;
                    case 'textarea':
                    case 'label':
                    case 'text':
                    case 'email':
                        field.value = '';
                        break;
                    case 'select':
                        const selectedOption = document.getElementById(field.name) as HTMLSelectElement;
                        if (selectedOption) {
                            field.value = selectedOption.options[0].value;
                        }
                        break;
                    case 'file':
                        field.value = null;
                        break;
                    default:
                        break;
                }
            }
        });
    }

    const callChangeHandlers = (changeHandlers: (() => void)[] | undefined) => {
        if (changeHandlers && Array.isArray(changeHandlers)) {
            for (const handler of changeHandlers) {
                if (typeof handler === 'function') {
                    handler();
                }
            }
        }
    };

    const handleInput = (field: FormField) => {
        const isValid = validateField(field);

        if (isValid) {
            callChangeHandlers(field.changeHandlers);
        }
    };

    const validateField = (field: FormField) => {
        const value = field.type === 'number' ? Number(field.value) : field.value;
        const result = field.validationSchema?.safeParse(value);

        if (result?.success) {
            // Validation succeeds
            field.validationError = null;
        } else {
            // Validation fails, update the error message
            field.validationError = { message: result.error.errors[0].message };
        }

        return result?.success || false;
    };

    const selectSuggestion = (field: FormField, suggestion: any) => {
        const searchField = field;
        searchField.value = suggestion.name;
        searchField.valueId = suggestion.id;
        searchField.suggestions = [];
    };

    const handleFileChange = async (formConfig, event) => {
        console.log('EVENT : ', event);
        formConfig.find(field => field.name === 'files').value = event;
    };

    const getFileUrl = (file) => {
        return `${import.meta.env.VITE_API_URL}/getImage/` + file
    };

    const getRequestBody = (formConfig) => {
        switch (instance) {
            case "products":
                const formProduct = new FormData();
                formProduct.append('file', formConfig.find(field => field.name === 'files').value)
                formProduct.append('CategoryId', formConfig.find(field => field.name === 'categories').value)
                formProduct.append('MarqueId', formConfig.find(field => field.name === 'brands').value )
                formProduct.append('name',  formConfig.find(field => field.name === 'name').value)
                formProduct.append('description', formConfig.find(field => field.name === 'description').value)
                formProduct.append('quantity', formConfig.find(field => field.name === 'quantite').value)
                formProduct.append('price', formConfig.find(field => field.name === 'prixTTC').value)
                formProduct.append('state',formConfig.find(field => field.name === 'state').value)
                formProduct.append('promotion', formConfig.find(field => field.name === 'promotion').value || 0)
                if(formConfig.find(field => field.name === 'images').value !== undefined) {
                    formProduct.append('image', formConfig.find(field => field.name === 'files').value.name)
                }
                formProduct.append('isPublished', formConfig.find(field => field.name === 'isPublished').isChecked)
                formProduct.append('resolution', formConfig.find(field => field.name === 'resolution').value)
                formProduct.append('size', formConfig.find(field => field.name === 'size').value)
                formProduct.append('storage', formConfig.find(field => field.name === 'storage').value)
                formProduct.append('loudspeaker', formConfig.find(field => field.name === 'loudspeaker').value)
                formProduct.append('frontcamera', formConfig.find(field => field.name === 'frontcamera').value)
                formProduct.append('weight', formConfig.find(field => field.name === 'weight').value)
                formProduct.append('width', formConfig.find(field => field.name === 'width').value)
                formProduct.append('height', formConfig.find(field => field.name === 'height').value)
                formProduct.append('battery', formConfig.find(field => field.name === 'battery').value)
                formProduct.append('code', formConfig.find(field => field.name === 'code').value)
                formProduct.append('accesories', formConfig.find(field => field.name === 'accesories').value)
                formProduct.append('operatingSystem', formConfig.find(field => field.name === 'os').value)
                formProduct.append('cpu', formConfig.find(field => field.name === 'cpu').value)
                formProduct.append('gpu', formConfig.find(field => field.name === 'gpu').value)
                formProduct.append('quantity_alert', formConfig.find(field => field.name === 'quantity_alert').value)
                return formProduct
            case "brands":
                const formMarque = new FormData();
                formMarque.append('file', formConfig.find(field => field.name === 'files').value)
                formMarque.append('name', formConfig.find(field => field.name === 'name').value)
                formMarque.append('description', formConfig.find(field => field.name === 'description').value)
                if(formConfig.find(field => field.name == "images").value != undefined) {
                    formMarque.append('image', formConfig.find(field => field.name === 'files').value.name)
                }else{
                    formMarque.append('image', "")
                }
                return formMarque
            case "categories":
                return {
                    name: formConfig.find(field => field.name === 'name').value,
                    description: formConfig.find(field => field.name === 'description').value,
                };
            case "users":
                console.log(formConfig.find(field => field.name === 'password').value);
                return {
                    firstname: formConfig.find(field => field.name === 'firstname').value,
                    lastname: formConfig.find(field => field.name === 'lastname').value,
                    gender: formConfig.find(field => field.name === 'gender').value,
                    dateOfBirth: formConfig.find(field => field.name === 'dateOfBirth').value,
                    email: formConfig.find(field => field.name === 'email').value,
                    phone: formConfig.find(field => field.name === 'phone').value,
                    address: formConfig.find(field => field.name === 'address').value,
                    zip: formConfig.find(field => field.name === 'zip').value,
                    city: formConfig.find(field => field.name === 'city').value,
                    role: formConfig.find(field => field.name === 'role').value,
                    isVerified: formConfig.find(field => field.name === 'isVerified').value,
                    isActive: formConfig.find(field => field.name === 'isActive').value,
                    // password: formConfig.find(field => field.name === 'password').value,
                }
            default:
                return;
        }
    };

    return { reinitForm, handleInput, handleFileChange, getFileUrl, listFormData, selectSuggestion, showField, callChangeHandlers, validateField, getRequestBody };
}
