# Implement Out of Stock Theme in Recently Viewed Product Cards

## Tasks
- [ ] Modify RelatedProduct component to include out of stock styling
- [ ] Add out of stock label overlay
- [ ] Apply opacity and cursor-not-allowed for out of stock items
- [ ] Disable "Add to bag" button for out of stock products
- [ ] Test the implementation

## Information Gathered
- ProductCard component already has comprehensive out of stock handling
- RelatedProduct component is used for Recently Viewed products and lacks out of stock styling
- Out of stock logic: `product?.stock < product?.minimumOrderQuantity || !product?.isActive || product?.stock <= 0`

## Plan
- Modify `RelatedProduct` component in `src/components/products/related-products.tsx`
- Add out of stock theme similar to `ProductCard` component
- Ensure consistent styling and behavior
