
const imageUrls = [
    'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/8be24f7f-b995-4d44-b223-42d0fdb9ce53/width=1200/8be24f7f-b995-4d44-b223-42d0fdb9ce53.jpeg',
    'https://preview.redd.it/frieren-redraw-by-me-v0-j2xh7x18o89c1.png?width=640&crop=smart&auto=webp&s=f9653fdfa8900d7702d374f17fa207f6cb56847c',
    'https://i.pinimg.com/originals/dc/80/c5/dc80c5160bd01d66a163ffe15c4e5517.jpg',
    'https://preview.redd.it/emma-changed-her-profile-picture-on-instagram-v0-6ijxe6sx133c1.png?width=1080&crop=smart&auto=webp&s=9369765d966ab0e406160ec418bf60a35d730225',
    'https://64.media.tumblr.com/e70b967c72953f72ba7c069355c00948/ffce7b432bf6495d-96/s640x960/3e16479562c41ef25d9a6dcd5ec872f043e37cf1.jpg',
    'https://avatarfiles.alphacoders.com/336/thumb-1920-336672.png',
    'https://i.pinimg.com/originals/03/4b/ed/034bed465f47fffbb23b4118c3339378.jpg',
    'https://pbs.twimg.com/media/FASppapUUAkclo-.jpg',
    'https://images.genius.com/f832b6756a76b9f48e1cd966d83a86ab.1000x1000x1.png',
    'https://images.tv9hindi.com/wp-content/uploads/2024/03/dolly-chai-latest-update-news-in-hindi.jpg',
    'https://i.pinimg.com/474x/47/56/49/4756495c2651166c5882c6c897be6332.jpg'
];

export const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * imageUrls.length);
    return imageUrls[randomIndex];
};
