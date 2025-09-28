const StatusBadge = ({ status, children }) => {
  const getStatusClasses = (status) => {
    switch (status) {
      case 'received':
        return 'status-badge status-received'
      case 'review':
        return 'status-badge status-review'
      case 'verified':
        return 'status-badge status-verified'
      case 'false':
        return 'status-badge status-false'
      default:
        return 'status-badge bg-gray-100 text-gray-800'
    }
  }

  return (
    <span className={getStatusClasses(status)}>
      {children}
    </span>
  )
}

export default StatusBadge
