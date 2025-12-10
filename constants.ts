// Images
export const BG_IMAGE = './image.png';
export const SOCK_IMAGE = './gemini_Generated_Image_pxl52cpxl52cpxl5.jpeg';

// Generate paths for gifts 1 to 35
export const getGiftImage = (id: number) => `./${id}.png`;

// Configuration
export const TOTAL_SOCKS = 35;
export const DRUMROLL_DURATION = 2000; // ms

// Sound Resources
// Reverted to local paths as requested
export const SOUNDS = {
  DRUMROLL: './drumroll.mp3', 
  TADA: './tada.mp3',
  BGM: './bgm.mp3'
};