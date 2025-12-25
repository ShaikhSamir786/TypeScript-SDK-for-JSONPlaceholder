import { HttpClient } from './core/http/http-client';
import { SdkConfig } from './core/config';
import { PostsClient } from './resources/posts/posts.client';

export class JsonPlaceholderClient {
    private readonly httpClient: HttpClient;
    public readonly posts: PostsClient;

    constructor(config: SdkConfig = {}) {
        this.httpClient = new HttpClient(config);
        this.posts = new PostsClient(this.httpClient);
    }
}
