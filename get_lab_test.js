const axios = require('axios');
axios.get('http://localhost:3000/api/labs/1').catch(e => console.log(e.message));
