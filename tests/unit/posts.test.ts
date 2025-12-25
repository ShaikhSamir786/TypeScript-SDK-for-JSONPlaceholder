import { PostsClient } from '../../src/resources/posts/posts.client';
import { HttpClient } from '../../src/core/http/http-client';
import { SdkConfig } from '../../src/core/config';

// Mock HttpClient
jest.mock('../../src/core/http/http-client');

describe('PostsClient', () => {
    let postsClient: PostsClient;
    let mockHttpClient: jest.Mocked<HttpClient>;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Setup mock
        const config: SdkConfig = {};
        mockHttpClient = new HttpClient(config) as any;
        postsClient = new PostsClient(mockHttpClient);
    });

    it('should list posts', async () => {
        const mockPosts = [{ id: 1, title: 'Test Post', body: 'Body', userId: 1 }];
        mockHttpClient.get.mockResolvedValue(mockPosts);

        const result = await postsClient.list();

        expect(mockHttpClient.get).toHaveBeenCalledWith('/posts');
        expect(result).toEqual(mockPosts);
    });

    it('should get post by id', async () => {
        const mockPost = { id: 1, title: 'Test Post', body: 'Body', userId: 1 };
        mockHttpClient.get.mockResolvedValue(mockPost);

        const result = await postsClient.getById(1);

        expect(mockHttpClient.get).toHaveBeenCalledWith('/posts/1');
        expect(result).toEqual(mockPost);
    });
});
