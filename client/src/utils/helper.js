import moment from 'moment';
import html2Canvas from 'html2Canvas';

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

export const getLightColorFromImage = async (imageUrl) => {
    return new Promise((resolve, reject) => {
        // check if the imageUrl is valid
        if (!imageUrl || typeof imageUrl !== 'string') {
            return reject(new Error('Invalid image URL'));
        }

        const img = new Image();

        // If not a base64 string, set crossOrigin (important for CORS)
        if (!imageUrl.startsWith('data:image/')) {
            img.crossOrigin = 'Anonymous';
        }

        img.src = imageUrl;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let r = 0, g = 0, b = 0, count = 0;

            for (let i = 0; i < imageData.length; i += 4) {
                let red = imageData[i];
                let green = imageData[i + 1];
                let blue = imageData[i + 2];

                let brightness = (red + green + blue) / 3; // Average brightness

                if (brightness > 100) {
                    r += red;
                    g += green;
                    b += blue;
                    count++;
                }
            }
            if (count === 0) {
                resolve('#ffffff'); // Fallback to white if no bright pixels found
            } else {
                r = Math.floor(r / count);
                g = Math.floor(g / count);
                b = Math.floor(b / count);
                resolve(`rgb(${r}, ${g}, ${b})`);
            }
        }

        img.onerror = (error) => {
            //console.log('❌ Error loading image:', error);

            reject(new Error('Image could not be loaded or is blocked by CORS' + error.message));
        };
    })
}

// Eg. May 2025
export function formatYearMoth(yearMonth) {
    return yearMonth ? moment(yearMonth, 'YYYY-MM').format('MMM YYYY') : '';
}

export const fixTailwindColors = (element) => {
    const elements = element.querySelectorAll('*');

    elements.forEach((el) => {
        const style = window.getComputedStyle(el);

        ['color', 'backgroundColor', 'borderColor'].forEach((prop) => {
            const value = style[prop];

            if (value.includes('oklch')) {
                el.style[prop] = '#000'; // or any safe Fallback
            }
        })
    })
}

// convert component to image
export async function captureElementAsImage(element) {
    if (!element) throw new Error('No Element provided');

    const canvas = await html2Canvas(element);
    return canvas.toDataURL('image/png');
}

// Utility to convert base64 data URL to a File Object
export const dataURLtoFile = (dataUrl, fileName) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?):/[1]);
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, { type: mime })
}