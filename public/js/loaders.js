export var loadImage = (url) => {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = url;
    });
};

export var loadJSON = (url) => {
    return fetch(url)
        .then(result => result.json());
};