export const createTextLayer = (font, text) => {
    const {
        size
    } = font;
    return function drawText(context) {
        font.print(text, context, ((Math.floor(context.canvas.width / size) / 2) - text.length / 2) * size,
            (Math.floor(context.canvas.height / size) / 2) * size);
    };
};