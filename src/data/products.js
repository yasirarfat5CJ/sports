import { batProducts } from "./products/bats.js";
import { gloveProducts } from "./products/gloves.js";
import { padProducts } from "./products/pads.js";
import { shoeProducts } from "./products/shoes.js";
import { sunglassProducts } from "./products/sunglasses.js";
import { trackProducts } from "./products/tracks.js";
import { tshirtProducts } from "./products/tshirts.js";

export const products = [
  ...batProducts,
  ...shoeProducts,
  ...sunglassProducts,
  ...padProducts,
  ...gloveProducts,
  ...tshirtProducts,
  ...trackProducts,
];
