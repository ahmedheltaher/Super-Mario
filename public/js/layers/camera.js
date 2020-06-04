export const creatCameraLayer = (cameraToDraw) => {
    return function drawCameraLayer(context, fromCamera) {
        context.strokeStyle = '#DA70D6';
        context.beginPath();
        context.rect(cameraToDraw.pos.x - fromCamera.pos.x, cameraToDraw.pos.y - fromCamera.pos.y, cameraToDraw.size.x, cameraToDraw.size.y);
        context.stroke();
    };
};