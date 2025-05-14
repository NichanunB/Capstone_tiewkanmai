const Card = ({ title, description, image, children }) => {
    return (
      <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white">
        {image && <img className="w-full h-48 object-cover" src={image} alt={title} />}
        <div className="p-4">
          {title && <h2 className="text-xl font-bold mb-2">{title}</h2>}
          {description && <p className="text-gray-700 text-base mb-4">{description}</p>}
          {children}
        </div>
      </div>
    );
  };
  
  export default Card;
  