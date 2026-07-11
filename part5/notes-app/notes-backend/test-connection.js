require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.TEST_MONGODB_URI

console.log('connecting to', url)

mongoose.set('bufferTimeoutMS', 5000) // يوقف الانتظار بعد 5 ثواني بدل ما يعلق للأبد

mongoose.connect(url)
  .then(() => {
    console.log('✅ connected successfully')
    mongoose.connection.close()
  })
  .catch((error) => {
    console.log('❌ connection failed:', error.message)
  })
