import { JsonPlaceholderClient } from '../src/jsonplaceholder-client';
import { ApiError } from '../src/errors/api-error';

async function separateStep(title: string, action: () => Promise<void>) {
    console.log(`\n--- ${title} ---`);
    await action();
}

async function main() {
    // 1. Initialize with custom config
    const client = new JsonPlaceholderClient({
        timeout: 5000,
        headers: {
            'User-Agent': 'Modern-SDK-Advanced-Example',
            'X-Custom-Header': 'foobar'
        }
    });

    // 2. Error Handling Demo
    await separateStep('Error Handling', async () => {
        try {
            console.log('Attempting to fetch non-existent post...');
            await client.posts.getById(99999);
        } catch (error) {
            if (error instanceof ApiError) {
                console.error(`Caught Expected API Error: ${error.statusCode} - ${error.message}`);
            } else {
                console.error('Caught Unexpected Error:', error);
            }
        }
    });

    // 3. Concurrent Requests
    await separateStep('Concurrent Requests', async () => {
        console.log('Fetching Post 1, 2, and 3 simultaneously...');
        const start = Date.now();
        const results = await Promise.all([
            client.posts.getById(1),
            client.posts.getById(2),
            client.posts.getById(3)
        ]);
        const duration = Date.now() - start;
        console.log(`Fetched ${results.length} posts in ${duration}ms`);
        results.forEach(p => console.log(`- Post ${p.id}: ${p.title.slice(0, 20)}...`));
    });

    // 4. Create and Update (Full Flow)
    await separateStep('Create & Update Flow', async () => {
        console.log('Creating new post...');
        const newPost = await client.posts.create({
            title: 'Advanced SDK Usage',
            body: 'Demonstrating robust usage patterns.',
            userId: 1
        });
        console.log('Created:', newPost);

        console.log('Updating post...');
        const updatedPost = await client.posts.update(newPost.id, {
            title: 'Advanced SDK Usage (Updated)'
        });
        console.log('Updated:', updatedPost);
    });
}

main().catch(console.error);
