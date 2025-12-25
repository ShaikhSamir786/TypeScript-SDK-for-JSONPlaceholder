import { JsonPlaceholderClient } from '../../src/jsonplaceholder-client';

// End-to-End Integration Test
// This typically hits the real API (or a high-fidelity mock).
// Since JSONPlaceholder is a public API, we can hit it directly for verification.

describe('Posts Integration', () => {
    let client: JsonPlaceholderClient;

    beforeAll(() => {
        client = new JsonPlaceholderClient({
            timeout: 10000
        });
    });

    it('should verify the full list->get flow', async () => {
        // 1. List
        const posts = await client.posts.list();
        expect(posts.length).toBeGreaterThan(0);
        const firstPost = posts[0];

        // 2. Get Detail
        const detail = await client.posts.getById(firstPost.id);
        expect(detail).toBeDefined();
        expect(detail.id).toBe(firstPost.id);
        expect(detail.title).toBe(firstPost.title);
    });

    it('should handle missing resources gracefully', async () => {
        await expect(client.posts.getById(999999)).rejects.toThrow();
    });
});
