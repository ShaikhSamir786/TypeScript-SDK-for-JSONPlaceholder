import { JsonPlaceholderClient } from '../src';

async function main() {
    const client = new JsonPlaceholderClient();

    try {
        console.log('Fetching posts...');
        const posts = await client.posts.list();
        console.log(`Found ${posts.length} posts.`);

        if (posts.length > 0) {
            console.log('Fetching detailed post 1...');
            const post = await client.posts.getById(1);
            console.log('Post 1 Title:', post.title);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
