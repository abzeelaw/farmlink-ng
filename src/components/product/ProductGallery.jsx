const ProductGallery = ({ product }) => {
  return (
    <div className="rounded-2xl bg-white p-4 shadow">
      <img
        src={product.image}
        alt={product.name}
        className="h-[380px] w-full rounded-xl object-cover"
      />
    </div>
  );
};

export default ProductGallery;