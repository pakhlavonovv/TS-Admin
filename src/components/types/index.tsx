export interface CategoryValues {
    name: string;
    description?: string;
    [key: string]: string | number | undefined;
  }
 export  interface EditingCategory {
    id: number;
    name: string;
    description?: string;
  }