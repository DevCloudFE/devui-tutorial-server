import { InMemoryDBEntity } from "@nestjs-addons/in-memory-db";

export interface ArticleEntity extends InMemoryDBEntity{
    title: string;
    tags: Array<string>;
    content: string;
    createTime: string;
    updateTime: string;
    status: 'published'| 'draft' | 'trash'| 'published-draft';
    draftContent: string;
}
