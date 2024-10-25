
const patientSchema = require('./models/user');
const docterSchema = require('./models/docter');
const bodyParser = require('body-parser');
const cors = require('cors');


const patientRoutes = require('./routes/patientRoutes');
const docterRoutes = require('./routes/docterRoutes');


const express = require('express');
const connectDB = require('./config/db'); 



const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
app.use(cors()); 

app.use(express.json()); 
app.use(bodyParser.json());

app.use('/api/patient', patientRoutes);
app.use('/api/docter', docterRoutes);



app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});



