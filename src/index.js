const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { PORT } = require('./config/server-config');
const apiRouter = require('./routes/index');
const db = require('./models/index');

const setupAndStartServer = () => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.use('/api',apiRouter);

    app.listen(PORT,()=>{
        console.log(`Server is running on ${PORT}`);
        if(process.env.DB_SYNC) {
            db.sequelize.sync({alter: true});
        }
        
    })
}

setupAndStartServer();