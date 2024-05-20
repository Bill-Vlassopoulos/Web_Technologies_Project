import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express'
import { engine } from 'express-handlebars'
import path from 'path'
import { info } from 'console';
import bodyParser from 'body-parser'

const model = await import('../model/queries.mjs')

const app = express()
const port = process.env.PORT || '3001';
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Χρήση της Handlebars σαν template engine
app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: 'index', // Specify the default layout template
    layoutsDir: path.join(__dirname, '../views/layouts'), // Specify the directory for layout templates
    partialsDir: path.join(__dirname, '../views/partials')//Specify the directory for navbar templates
}));

// Ορίζουμε πως η 'hbs' θα είναι η μηχανή template (δηλ. θα ενεργοποιείται με την res.render()) 
app.set('view engine', 'hbs');

// Δηλώνουμε πως ο φάκελος "public" θα περιέχει τα στατικά αρχεία
app.use(express.static(path.join(__dirname, '../public')));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);



//Open Main Page
router.get('/', (req, res) => {
    // Determine the CSS file path based on the route
    const cssFilePath = '/style.css'; // Adjust the path as needed

    // Render the 'main' template with the CSS file path
    res.render('main', { layout: 'index', css: cssFilePath });
});

//Δημιουργώ διαδρομή για την βιογραφία
router.get('/biography', (req, res) => {
    const cssFilePath = '/bio_style.css';

    res.render('biography', { layout: 'index', css: cssFilePath });
});



//Δημιουργώ διαδρομή για την πρώτη σελίδα της βιογραφίας
router.get("/biography/earliest-paintings", (req, res) => {
    const cssFilePath = '/bio_style.css';

    res.render('bio_page1', { layout: 'index', css: cssFilePath });
});

//Δημιουργώ διαδρομή για την δεύτερη σελίδα της βιογραφίας
router.get("/biography/nuenen", (req, res) => {
    const cssFilePath = '/bio_style.css';

    res.render('bio_page_2', { layout: 'index', css: cssFilePath });
});

//Δημιουργώ διαδρομή για την τρίτη σελίδα της βιογραφίας
router.get("/biography/paris", (req, res) => {
    const cssFilePath = '/bio_style.css';

    res.render('bio_page3', { layout: 'index', css: cssFilePath });
});

//Δημιουργώ διαδρομή για την τέταρτη σελίδα της βιογραφίας
router.get("/biography/arles", (req, res) => {
    const cssFilePath = '/bio_style.css';

    res.render('bio_page4', { layout: 'index', css: cssFilePath });
});

//Δημιουργώ διαδρομή για την πέμπτη σελίδα της βιογραφίας
router.get("/biography/saint-remy", (req, res) => {
    const cssFilePath = '/bio_style.css';

    res.render('bio_page5', { layout: 'index', css: cssFilePath });
});

//Δημιουργώ διαδρομή για την έκτη σελίδα της βιογραφίας
router.get("/biography/auvers-sur-oise", (req, res) => {
    const cssFilePath = '/bio_style.css'
    res.render('bio_page6', { layout: 'index', css: cssFilePath });
});

//Δημιουργώ διαδρομή για την επικοινωνία 
router.get("/communication", (req, res) => {
    const cssFilePath = '/forma_epikoin.css'

    res.render('epikoinwnia', { layout: 'index', css: cssFilePath });
});

//Δημιουργώ διαδρομή για την συλλογή
router.get("/collection", (req, res) => {
    let links = model.getErgaWithDescription();
    const cssFilePath = '/collection-style.css'

    res.render('collection', { layout: 'index', links: links, css: cssFilePath });
});


//Δημιουργώ διαδρομή για τις λεπτομέρειες της συλλογής
router.get("/collection/:arithmos_ergou", (req, res) => {
    let ergo_info = model.getErgo(req.params.arithmos_ergou);
    const cssFilePath = '/collection-style.css'

    res.render('collection-template', { layout: 'index', info: ergo_info, css: cssFilePath });
});


//Δημιουργώ διαδρομή για τα εισιτήρια
router.get("/tickets", (req, res) => {
    const cssFilePath = '/tickets_style.css'
    res.render('tickets', { layout: 'index', css: cssFilePath });

});


router.post("/submit", (req, res) => {
    // Handle form submission

    let info = req.body;
    console.log(info);
    // console.log(info[info.length - 1]);
    model.insertNewEpiskeptis(info[info.length - 1].onoma, info[info.length - 1].mail, info[info.length - 1].phone);
    let id_episkepti = model.getIdofLastEpiskeptis();
    for (let i = 0; i < info.length - 1; i++) {
        model.insertNewEisitirio(info[i].imerom, info[i].ora, info[i].katigoria, id_episkepti["id_episkepti"]);
    }
    res.send("All good");
});


//Δημιουργώ διαδρομή για τις εκθέσεις
router.get("/exhibitions", (req, res) => {
    const cssFilePath = '/ektheseis-style.css'

    res.render('ektheseis', { layout: 'index', css: cssFilePath });
});

//Δημιουργώ διαδρομή για τον διαχειριστή

router.get("/admin/edit", (req, res) => {

    const cssFilePath = '/admin-style.css'
    let erga = model.getAllErgaAllInfo();
    res.render('admin-main', { layout: 'admin', erga: erga, css: cssFilePath });

});

//Δημιουργώ διαδρομή για το editing του κάθε έργου
router.get("/admin/edit/:arithmos_ergou", (req, res) => {
    const cssFilePath = '/admin-style.css'
    let ergo_info = model.getErgo(req.params.arithmos_ergou);
    res.render('admin-edit', { layout: 'admin', info: ergo_info, css: cssFilePath });
});

//Δημιουργώ διαδρομή για την προσθήκη ενός έργου
router.get("/admin/addPainting", (req, res) => {
    const cssFilePath = '/admin-style.css'
    let aithouses = model.getAithouses();
    res.render('admin-add', { layout: 'admin', aithouses: aithouses, css: cssFilePath });
});

router.post("/admin/addPainting/submit", (req, res) => {
    let info = req.body;
    console.log(info);
    model.insertNewErgo(info.code, info.link, info.date, info.size, info.type, info.title, info.content, info.artist);
    res.redirect('/admin');
});

router.get("/admin/addExhibition", (req, res) => {
    const cssFilePath = '/add-exhibition.css'
    let erga = model.getAllErgaAllInfo();
    res.render('admin-add-exhibition', { layout: 'admin', erga: erga, css: cssFilePath });
});

router.get("/admin/addExhibition2", (req, res) => {
    const cssFilePath = '/add-exhibition-2.css'
    let erga = model.getAllErgaAllInfo();
    res.render('admin-add-exhibition-2', { layout: 'admin', erga: erga, css: cssFilePath });
});

router.get("/admin/edit/delete/:arithmos_ergou", (req, res) => {
    model.deleteErgo(req.params.arithmos_ergou);
    res.redirect('/admin/edit');
});




app.listen(port, () => console.log(`Open Vincent Van Gogh Gallery http://localhost:${port}/ `));
console.log(`Open Admin Page http://localhost:${port}/admin/edit`);