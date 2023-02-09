const express = require('express'),
cors = require('cors'),
{MongoClient} = require('mongodb');

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 3000;


app.listen(PORT, async () => {
    console.log(`Server is running on port: ${PORT}`);
    let db;
    const mongoConnect = async () => {
        /* Connect to Mongo */
        const uri = "mongodb+srv://root:mBMwguDnEkynrTBp@cluster0.knckumz.mongodb.net/frgbaseapi?retryWrites=true&w=majority";
        const client = new MongoClient(uri, {useNewUrlParser: true});
        try {
            await client.connect()
            .then(async () => {
                console.log(`MongoDB Connected on port: ${PORT}`);
                db = client.db('frgbaseapi');
            })
        } catch (e) {
            console.error(`Error connecting to MongoDB: ${e}`);
        }
    }
    await mongoConnect();


    app.get('/api/:collection', async (req, res) => {
        const collection = req.params.collection;
        const date = req.query.date;
        if(collection == 'dashboard_page'){
            const validDate = (date) => {
                var dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                return dateRegex.test(date);
            }
            var testDate = await validDate(date);
            if(testDate == true){
                try {
                    await db.collection(collection).find({ createdAtQ: date }).toArray()
                    .then((result) => {
                        console.log('An consult as occurred', req)
                        res.send(result)
                    })
                    .catch((e) => {
                        console.error(e)
                    })
                } catch (e) {
                    console.error(e)
                }
            } else {
                console.log('Insert a valid date query!')
            }
        } else {
            console.log('Insert a valid collection!')
        }
        
    });
})