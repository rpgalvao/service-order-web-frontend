/**
 * Aplica máscara de Telefone Fixo (00) 0000-0000 ou Celular (00) 00000-0000
 */
export const formatPhone = (value: string | null | undefined): string => {
    if (!value) return '';

    // Remove tudo que não for número
    const numbers = value.replace(/\D/g, '');

    // Aplica a máscara: (00) 00000-0000 ou (00) 0000-0000
    if (numbers.length <= 10) {
        return numbers
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .slice(0, 14); // Limita o tamanho para fixo
    }

    return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .slice(0, 15); // Limita o tamanho para celular
};

/**
 * Aplica máscara de CPF (000.000.000-00) ou CNPJ (00.000.000/0000-00)
 */
export const formatDocument = (value: string): string => {
    const numbers = value.replace(/\D/g, ''); // Remove tudo que não for número

    if (numbers.length <= 11) {
        // Máscara de CPF
        return numbers
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1'); // Limita o tamanho
    } else {
        // Máscara de CNPJ
        return numbers
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1'); // Limita o tamanho
    }
};

/**
 * Converte qualquer texto para o padrão Title Case.
 * Ex: "DISTRIBUIDORA de peças" vira "Distribuidora de Peças"
 */
export const toTitleCase = (text: string): string => {
    if (!text) return '';

    // Lista de preposições que devem continuar minúsculas
    const prepositions = ['de', 'da', 'do', 'das', 'dos', 'e', 'em', 'na', 'no', 'com'];

    return text
        .toLowerCase()
        .split(/\s+/) // Divide o texto por espaços
        .map((word, index) => {
            if (word.length === 0) return word;
            // Se não for a primeira palavra e for uma preposição, deixa minúscula
            if (index !== 0 && prepositions.includes(word)) {
                return word;
            }
            // Capitaliza a primeira letra da palavra
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
};