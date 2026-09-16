export const products = [ 
  {
    id: "shoe-3",
    productTypeId: "type-cricket-shoes",
    name: "Batting Comfort Cricket Shoes",
    price: 1899,
    images: ["/images/shoes/asicss1.jpg","/images/shoes/asicss2.jpg","/images/shoes/asicss3.jpg"],
    description:
      "Lightweight cricket shoes with toe protection and cushioned midsoles for long batting sessions at the crease.",
    specifications: [
      { label: "Sole", value: "Hybrid rubber" },
      { label: "Toe", value: "Reinforced guard" },
      { label: "Sizes", value: "UK 6-10" },
    ],
    availability: "limited",
  },
  {
    id: "sunglass-1",
    productTypeId: "type-sports-sunglasses",
    name: "Oakley Style Sports Sunglasses",
    price: 749,
    images: [
      "/images/sunglasses/white-sports-sunglasses.jpeg",
      "/images/sunglasses/red-sports-sunglasses.jpeg",
      "/images/sunglasses/blue1.jpg",
      "/images/sunglasses/blue2.jpg"
    ],
    description:
      "Wraparound sports sunglasses with mirrored lenses and a secure fit for cricket fielding, running, and sunny outdoor practice.",
    specifications: [
      { label: "MRP", value: "₹749" },
      { label: "Lens", value: "Mirrored shield" },
      { label: "Frame", value: "Lightweight sports frame" },
    ],
    availability: "in-stock",
  },
  {
  id: "pad",
  productTypeId: "type-cricket-pad",
  name: "Cricket Pad",
  price: 2499,
  images: [
    "/images/pads/sg1.jpg",
    "/images/pads/sg2.jpg",
    "/images/pads/sg3.jpg",
    "/images/pads/ss1.jpg",
    "/images/pads/ss2.jpg",
    "/images/pads/bpad1.jpg",
    "/images/pads/bpad2.jpg"
  ],
  description:
    "Lightweight and durable cricket pads designed for comfortable movement and reliable protection during play.",
  specifications: [
    { label: "MRP", value: "₹2499" },
    { label: "Type", value: "Cricket Batting Pad" },
    { label: "Material", value: "Durable protective material" },
    { label: "Protection", value: "Leg and knee protection" }
  ],
  availability: "limited",
},
{
  id: "gloves",
  productTypeId: "type-cricket-gloves",
  name: "Cricket Gloves",
  price: 1899,
  images: [
    "/images/gloves/gbas1.jpg",
    "/images/gloves/gbas2.jpg",
    "/images/gloves/gnic1.jpg",
    "/images/gloves/gnic2.jpg",
    "/images/gloves/gnic3.jpg"
  ],
  description:
    "Comfortable and durable cricket gloves designed for a secure grip, flexibility, and reliable hand protection during play.",
  specifications: [
    { label: "MRP", value: "₹1899" },
    { label: "Type", value: "Cricket Batting Gloves" },
    { label: "Grip", value: "Secure and comfortable grip" },
    { label: "Protection", value: "Reliable hand protection" }
  ],
  availability: "limited",
},
];
