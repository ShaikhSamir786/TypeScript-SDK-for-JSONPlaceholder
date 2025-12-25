import { HttpClient } from '../../core/http/http-client';
import { Post, CreatePostRequest, UpdatePostRequest } from './posts.types';

export class PostsClient {
    constructor(private readonly client: HttpClient) { }

    public async list(): Promise<Post[]> {
        return this.client.get<Post[]>('/posts');
    }

    public async getById(id: number): Promise<Post> {
        return this.client.get<Post>(`/posts/${id}`);
    }

    public async create(post: CreatePostRequest): Promise<Post> {
        return this.client.post<Post>('/posts', post);
    }

    public async update(id: number, post: UpdatePostRequest): Promise<Post> {
        return this.client.put<Post>(`/posts/${id}`, post);
    }

    public async delete(id: number): Promise<void> {
        return this.client.delete<void>(`/posts/${id}`);
    }
}
