import { z } from "zod";
import { ref } from "vue";
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

export function useForm() {
    const listFormData = ref([]);
    const showField = (field: FormField) => {
        return !field.showCondition || (field.showCondition && field.showCondition());
    };

    const reinitForm = (formConfig) => {
        console.log('Formulaire réinitialisé !');
        console.log(formConfig);

        const fieldsToReset = formConfig.value.filter(field => field.type !== 'button').map(field => field.name);

        // Réinitialiser les erreurs de validation pour les champs pertinents
        formConfig.value
            .filter(field => field.type !== 'button' && field.validationError != null)
            // .forEach(field => {
                // this.$nextTick(() => {
                //     field.validationError = '';
                // });
            // });

        // Réinitialiser les valeurs des champs
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
                        // Gérer d'autres types de champs ici si nécessaire
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
        const result:any = field.validationSchema?.safeParse(field.value);

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

    return { reinitForm, handleInput, handleFileChange, getFileUrl, listFormData, selectSuggestion, showField, callChangeHandlers, validateField };
}
