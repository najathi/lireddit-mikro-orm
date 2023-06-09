import { Query, Resolver, Ctx, Arg, Mutation } from "type-graphql";
import { RequiredEntityData } from "@mikro-orm/core";

import { Post } from "../entities/Post";
import { MyContext } from "../types";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    async posts(@Ctx() { em }: MyContext): Promise<Post[]> {
        return await em.find(Post, {});
    }

    @Query(() => Post, { nullable: true })
    async post(
        @Arg("id") id: number,
        @Ctx() { em }: MyContext,
    ): Promise<Post | null> {
        return await em.findOne(Post, id)
    }

    @Mutation(() => Post)
    async createPost(
        @Arg("title") title: string,
        @Ctx() { em }: MyContext,
    ): Promise<Post> {
        const post = em.create(Post, { title } as RequiredEntityData<Post>);
        await em.persistAndFlush(post);
        return post;
    }

    @Mutation(() => Post, { nullable: true })
    async updatePost(
        @Arg("identifier") id: number,
        @Arg("title", () => String, { nullable: true }) title: string,
        @Ctx() { em }: MyContext,
    ): Promise<Post | null> {
        const post = await em.findOne(Post, id);
        if (!post) {
            return null;
        }
        if (typeof title !== 'undefined') {
            post.title = title;
            await em.persistAndFlush(post);
        }
        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg("id") id: number,
        @Ctx() { em }: MyContext,
    ): Promise<Boolean> {
        await em.nativeDelete(Post, id);
        return true;
    }
}
