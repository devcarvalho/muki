function isToday (date) {  
    const now = new Date()
  
    return date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
}

  export default isToday;