export interface CategorySchema {
    categories: Category[];
}

export interface Category {
    category_name: string;
}

export interface CategoryListOutput {
    categories: CategoryOutput[];
}

export interface CategoryOutput {
    categoryName: string;
}


export function transfromToCategoryListOutput(
    response: CategorySchema
  ): CategoryListOutput {
    const result: CategoryListOutput = {
      categories: response.categories.map((data) => {
        return {
          categoryName: data.category_name
        };
      }),
    };
    return result;
  }