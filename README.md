# Kabeer Sports

A clean React catalog for Kabeer Sports, focused on cricket products with hardcoded tennis bats and cricket shoes for now.
## Run Locally

```bash
npm install
npm run dev
```

## Where To Update Products

Data is split into small files inside [src/data](/home/yasirarfat18/sports/src/data).

- Add or rename shop details in [src/data/shop.js](/home/yasirarfat18/sports/src/data/shop.js).
- Add categories in [src/data/productTypes.js](/home/yasirarfat18/sports/src/data/productTypes.js).
- Add products in [src/data/products.js](/home/yasirarfat18/sports/src/data/products.js).
- Update stock labels in [src/data/availability.js](/home/yasirarfat18/sports/src/data/availability.js).
- Product `productTypeId` must match one of the category `id` values.
- Store project images in `public/images/...`.
- Use image paths like `/images/sunglasses/white-sports-sunglasses.jpeg`.
- Product images can also use full online URLs later.

## How To Connect A Backend Later

The UI reads and writes through [src/hooks/useCatalogStore.js](/home/yasirarfat18/sports/src/hooks/useCatalogStore.js). Replace the in-memory arrays with `fetch()` calls to your backend endpoints:

- `GET /api/product-types`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/auth/login`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

Keep the returned product shape the same as [src/data/products.js](/home/yasirarfat18/sports/src/data/products.js) and the screens will continue to work.

## WhatsApp Buy Button

The product detail page opens WhatsApp using the number in `shop.whatsappNumber` inside [src/data/shop.js](/home/yasirarfat18/sports/src/data/shop.js).

The message includes the product name, price, and image link. During local development the image link will look like `http://localhost:5174/images/...`; after hosting the site, it will use your real website domain.

## Cloudinary Images

Keep Cloudinary secrets in a backend `.env` file, not inside React files. The example format is in [.env.example](/home/yasirarfat18/sports/.env.example):

```bash
CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@agjyxopo
```

Flow for real uploads:

```text
Admin selects image -> backend uploads to Cloudinary -> backend saves returned image URL -> frontend displays that URL
```

If admin pastes a Cloudinary image URL, the image does not need to be in `public/images`. If admin uses a local app path like `/images/bats/bat1.jpeg`, the file must exist inside `public/images/bats/bat1.jpeg`.
