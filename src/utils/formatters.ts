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