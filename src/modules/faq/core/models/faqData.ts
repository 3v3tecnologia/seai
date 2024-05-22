export type FaqWithCategoriesData = {
    id: number;
    question: string;
    answer: string;
    order: number;
    created_at?: string;
    updated_at?: string;
    category: FaqCategoriesData;
};

export type FaqCategoriesData = {
    id: number;
    title: string;
    description: string;
    created_at?: string;
    updated_at?: string;
};