const ProductGallery = ({ product }) => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      <img
        src={product.image}
        alt={product.name}
        className="h-[500px] w-full rounded-2xl object-cover"
      />
    </div>
  );
};

export default ProductGallery;