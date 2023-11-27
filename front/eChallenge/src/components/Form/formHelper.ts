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

export function useForm(formConfig: FormField[]) {
    const files = ref([]);
    const showField = (field: FormField) => {
        return !field.showCondition || (field.showCondition && field.showCondition());
    };

    const reinitForm = () => {
        console.log('Formulaire réinitialisé !');

        const fieldsToReset = formConfig.filter(field => field.type !== 'button').map(field => field.name);

        for (const fieldName of fieldsToReset) {
            const field = formFields.find(field => field.name === fieldName);
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
                }
            }
        }
    };

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
        const result = field.validationSchema?.safeParse(field.value);

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

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        files.value = selectedFiles;
    };

    const getFileUrl = (file) => {
        return URL.createObjectURL(file);
    };

    return { reinitForm, handleInput, handleFileChange, getFileUrl, files, selectSuggestion, showField, callChangeHandlers, validateField };
}
