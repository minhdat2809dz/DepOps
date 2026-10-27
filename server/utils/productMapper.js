function mapProductFromDb(row) {
  if (!row) return null;

  const tryParse = (str, fallback) => {
    if (!str) return fallback;
    try {
      return JSON.parse(str);
    } catch {
      return fallback;
    }
  };

  return {
    id: row.Id,
    name: row.Name,
    brand: row.Brand || '',
    category: row.Category,
    categoryName: row.CategoryName || '',
    price: Number(row.Price),
    oldPrice: row.OldPrice ? Number(row.OldPrice) : null,
    rating: row.Rating !== null ? Number(row.Rating) : 5.0,
    reviewsCount: row.ReviewsCount || 0,
    image: row.Image || '',
    badge: row.Badge || '',
    description: row.Description || '',
    stock: row.Stock || 'Sẵn hàng',
    flashSale: Boolean(row.FlashSale),
    flashDiscount: row.FlashDiscount || 0,
    soldCount: row.SoldCount || 0,
    gift: row.Gift || '',
    specs: tryParse(row.SpecsJson, {}),
    colors: tryParse(row.ColorsJson, []),
    storageOptions: tryParse(row.StorageOptionsJson, []),
    gallery: tryParse(row.GalleryJson, row.Image ? [row.Image] : []),
    reviews: tryParse(row.ReviewsJson, []),
    createdAt: row.CreatedAt,
    updatedAt: row.UpdatedAt
  };
}

module.exports = { mapProductFromDb };
