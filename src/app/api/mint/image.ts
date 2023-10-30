import { createCanvas } from "canvas";
import fs from "fs";
export const create_image = (score: number) => {
    // Dimensions for the image
    const width = 1200;
    const height = 1200;

    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    context.fillStyle = "#764abc";
    context.fillRect(0, 0, width, height);

    // Set the style of the test and render it to the canvas
    context.font = "bold 70pt 'PT Sans'";
    context.textAlign = "center";
    context.fillStyle = "#fff";

    context.fillText(score.toString(), 600, 170);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync("./image.png", buffer);
}