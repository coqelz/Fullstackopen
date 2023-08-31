const Notification = ({  label }) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  if (label  === '') return null

  return (
    <div style={style}>
      {label}
    </div>
  )
}

export default Notification
