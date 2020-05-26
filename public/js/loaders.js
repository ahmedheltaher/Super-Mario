export var loadImage = function (url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = url;
    });
};


export var loadLevel = function (name) {
    return fetch(`/levels/${name}.json`)
    .then(result => result.json());
};


// export var loadLevel = async function (name) {
//     const result = await fetch(`/levels/${name}.json`);
//     return await result.json();
// };
