const Notification = ({ dispatch, type, label }) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  //if (true) return null

  return (
    <div style={style}>
      {label}
    </div>
  )
}

export default Notification
