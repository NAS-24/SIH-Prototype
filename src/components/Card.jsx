const Card = ({ children, className = '', onClick, hover = true }) => {
  const baseClasses = "card p-6"
  const hoverClasses = hover ? "cursor-pointer hover:shadow-xl" : ""
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Card
