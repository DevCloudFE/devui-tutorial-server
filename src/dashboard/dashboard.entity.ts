import { InMemoryDBEntity } from "@nestjs-addons/in-memory-db";

 interface AuthorEntity {
    name: string;
    title: string;
}


 interface ColumnEntity {
    name: string;
    title: string;
}


 interface CardsEntity {
    count: string;
    week: string;
    day: string;
}

export interface  DashboardEntity extends InMemoryDBEntity{ 
   authors: Array<AuthorEntity>;
   columns: Array<ColumnEntity>;
   cards: Array<CardsEntity>;
}