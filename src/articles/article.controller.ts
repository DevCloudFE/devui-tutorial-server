import { Controller, Get, Param, Query, Post, Body, Put, Delete, Optional, HttpCode } from "@nestjs/common";
import { ArticleEntity } from "./articles.entity";
import { InMemoryDBService } from "@nestjs-addons/in-memory-db";
type QueryCondition = {
    keyword?: string;
    date?: [number, number];
    tags: string[];
}
const ARTICLE_TYPE_ARRAY = ['published', 'draft', 'trash', 'published-draft'];
@Controller('articles')
export class ArticleController {
    private pageIndex = 1;
    private pageSize = 20;
    constructor(private readonly articleService: InMemoryDBService<ArticleEntity>){
        const createTime = new Date().getTime() + '';
        this.articleService.create({title: 'DevUI设计', tags: ['DevUI'], content: '欢迎加入七天训练营，在这里你将得到最完善的DevUI教学，享受最前沿的设计体验，赶快加入我们吧！', createTime, updateTime: createTime, status: 'published' })
        this.articleService.create({title: '前端发展史', tags: ['前端'], content: '欢迎加入七天训练营，在这里你将得到最完善的DevUI教学，享受最前沿的设计体验，赶快加入我们吧！', createTime, updateTime: createTime, status: 'published' })
    }

    @Post()
    postArticle(@Body() body: ArticleEntity){
        const createTime = new Date().getTime() + '';
        const article = this.articleService.create(Object.assign(body,{createTime, updateTime: createTime, status: body.status || 'published'}));
        return {id: article.id};
    }

    @Put()
    updateArticle(@Body() body: ArticleEntity) {
        const updateTime = new Date().getTime() + '';
        this.articleService.update(Object.assign(body, {updateTime}));
        return {id: body.id};
    }

    @Get(['', 'query/:type'])
    getList(@Query('page') page, @Query('size') size, @Optional() @Param('type') type) {
        const status = ARTICLE_TYPE_ARRAY.includes(type) ? type: 'published';
        const articles = this.articleService.getAll().reverse().filter(
            article => article.status.indexOf(status) > -1
        );
        const {total, start, end} = this.getPager(articles.length, page, size);
        return {total: total, articles: articles.slice(start, end)}
    }

    @Get(':id')
    getDetail(@Param('id') id) {
        const article = this.articleService.get(id);
        const status = article.status;
        const articles = this.articleService.getAll().reverse().filter(
            article => article.status.indexOf(status) > -1
        );
        const currentIndex = articles.findIndex(article => +article.id === +id);
        const prePageId = articles[currentIndex - 1]?.id;
        const nextPageId = articles[currentIndex + 1]?.id;
        return {article, prePageId, nextPageId};
    }

    @Delete(':id')
    deleteArticle(@Param('id') id) {
        const articleId = +id;
        const articles = this.articleService.getAll().reverse();
        const currentIndex = articles.findIndex(article => article.id === articleId);
        const prePageId = articles[currentIndex - 1]?.id;
        const nextPageId = articles[currentIndex + 1]?.id;
        this.articleService.delete(articleId);
        return {delete: articleId,  prePageId, nextPageId};
    }

    @Post('batchDelete')
    @HttpCode(200)
    deleteMany(@Body('ids') ids: number[]) {
        this.articleService.deleteMany(ids);
        return {deleted: ids};
    }

    @Put(':type')
    moveToDraft(@Param('type') type, @Body('ids') ids: number[]) {
        const status = ARTICLE_TYPE_ARRAY.includes(type) ? type: 'published';
        const articles = this.articleService.getMany(ids).map(
            (art: ArticleEntity) => {
                if (status ==='published' && art.status === 'published-draft') {
                    Object.assign(art, {content: art.draftContent, draftContent: ''})
                }
                return Object.assign(art, {status: status});
            }
        );
        this.articleService.updateMany(articles);
        return { updated: ids };
    }

    @Post(['query','query/:type'])
    @HttpCode(200)
    query(@Body() body: QueryCondition, @Query('page') page, @Query('size') size, @Optional() @Param('type') type) {
        const status = ARTICLE_TYPE_ARRAY.includes(type) ? type: 'published';
        const articleList = this.articleService.getAll().reverse().filter(
            article => article.status.indexOf(status) > -1
        );
        const articles = articleList.filter(article => this.getQueryConditionFilter(body, article));
        const {total, start, end} = this.getPager(articles.length, page, size);
        return {total, articles: articles.slice(start, end)}
    }

    private getQueryConditionFilter(queryCondition: QueryCondition, article: ArticleEntity) {
        const {keyword, date, tags} = queryCondition;
        const searchTitle = (kw: string) => {
            return article.title && article.title.includes(kw.toLowerCase());
        }
        const queryDate = (dates: [number, number]) => {
            const articleDate = article.updateTime || article.createTime;
            return (dates[0] ? +articleDate >= date[0] : true)
                && (dates[1] ? +articleDate <= date[1] : true);
        }
        const queryTags = (tags: string[]) => {
            const intersection = article.tags.filter(v => tags.includes(v));
            return intersection.length > 0;
        }
        return (keyword && keyword.length > 0? searchTitle(keyword): true)
            && (date ? queryDate(date) : true)
            && (tags && tags.length > 0 ? queryTags(tags) : true);
    }

    private getPager(total, pageIndex, pageSize) {
        const page = +pageIndex || this.pageIndex;
        const size = +pageSize || this.pageSize;
        const start = (page - 1) * size;
        let end = start + size;
        end = total <= end ? total : end;
        return {total, page, size, start, end};
    }
}