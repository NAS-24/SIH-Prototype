const AlertCard = ({ type, title, description, className = '' }) => {
  const getAlertClasses = (type) => {
    switch (type) {
      case 'advisory':
        return 'alert-advisory'
      case 'warning':
        return 'alert-warning'
      case 'information':
        return 'alert-information'
      default:
        return 'bg-gray-100 text-gray-800 border-l-4 border-gray-500'
    }
  }

  return (
    <div className={`p-4 rounded-lg ${getAlertClasses(type)} ${className}`}>
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm">{description}</p>
    </div>
  )
}

export default AlertCard
