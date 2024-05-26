import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express'
import { engine } from 'express-handlebars'
import path from 'path'
import bodyParser from 'body-parser'
import taskListSession from '../app-setup/app-setup-session.mjs';
import * as logInController from '../controller/login-controller.mjs';
import { log } from 'console';

const model = await import('../model/queries.mjs')

const app = express()
const port = process.env.PORT || '3000';
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let ex_info = {};
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

app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Ενεργοποίηση συνεδρίας
app.use(taskListSession)

//Ελέγχω πως υπάρχει ο χρήστης 
app.use((req, res, next) => {
    if (req.session && req.session.loggedUserId) {
        res.locals.userId = req.session.loggedUserId;
        //console.log("Logged in user ID:", res.locals.userId);
    } else {
        res.locals.userId = 'επισκέπτης';
        //console.log("User is a visitor");
    }
    next();
});

app.use(router);

//*ΧΡΗΣΤΗΣ*//

//Open Main Page
router.get('/', (req, res) => {
    // Determine the CSS file path based on the route
    const cssFilePath = '/style.css'; // Adjust the path as needed
    let ektheseis = model.last2Ektheseis();
    //Μετατροπή ημερομηνίας
    ektheseis.forEach(item => {
        // Μετατροπή ημερομηνίας εναρξης
        const enarxisDate = new Date(item.imerominia_enarxis);
        const enarxisDay = enarxisDate.getDate();
        const enarxisMonth = enarxisDate.toLocaleDateString('el-GR', { month: 'long' });
        const enarxisYear = enarxisDate.getFullYear();
        item.enarxisDay = enarxisDay;
        item.enarxisMonth = enarxisMonth;
        item.enarxisYear = enarxisYear;
      
        // Μετατροπή ημερομηνίας λήξης
        const lixisDate = new Date(item.imerominia_lixis);
        const lixisDay = lixisDate.getDate();
        const lixisMonth = lixisDate.toLocaleDateString('el-GR', { month: 'long' });
        const lixisYear = lixisDate.getFullYear();
        item.lixisDay = lixisDay;
        item.lixisMonth = lixisMonth;
        item.lixisYear = lixisYear;
      });

  //console.log(ektheseis);

    // Render the 'main' template with the CSS file path
    res.render('main', { layout: 'index', ektheseis: ektheseis, css: cssFilePath });
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

router.get('/api/collection', async (req, res) => {
    let links = await model.getAllErga(); // Ensure this returns a promise if it doesn't already
    res.json(links);
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
    let ektheseis = model.getCurrentAndFutureEktheseis();
    res.render('tickets', { layout: 'index', ektheseis: JSON.stringify(ektheseis), css: cssFilePath });

});

//Submit εισιτηρίων
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
    let id_eisitirion = model.getLastiticketids(info.length - 1);
    id_eisitirion.reverse();
    console.log(id_eisitirion);
    for (let i = 0; i < info.length - 1; i++) {
        for (let j = 0; j < info[i].periodikes_ektheseis.length; j++) {
            model.insertAntistoixei(id_eisitirion[i].id_eisitiriou, info[i].periodikes_ektheseis[j]);
        }
    }
    res.send("All good");
});


//Δημιουργώ διαδρομή για τις εκθέσεις
router.get("/exhibitions", (req, res) => {
    const cssFilePath = '/ektheseis-style.css'
    let future_exh = model.getFutureExhibitions();
    let current_exh = model.getAllCurrentEktheseis();

    res.render('ektheseis', { layout: 'index', future_exh: future_exh, current_exh: current_exh, css: cssFilePath });
});

//*ΔΙΑΧΕΙΡΙΣΤΗΣ *//

//Δημιουργία διαδρομής για το login του admin
router.route('/admin/login').get(logInController.showLogInForm);

// // //Αυτή η διαδρομή καλείται όταν η φόρμα φτάσει στον εξυπηρετητή με POST στο /login. Διεκπεραιώνει τη σύνδεση (login) του χρήστη
router.route('/login').post(logInController.doLogin);

// //Αποσυνδέει το χρήστη
router.route('/admin/logout').get(logInController.doLogout);

//**ΕΡΓΑ **//

//Διαδρομή μετά το login, στην σελίδα με τα έργα
router.get("/admin/edit", logInController.checkAuthenticated, (req, res) => {

    const cssFilePath = '/admin-style.css'
    let erga = model.getErgaWithCurrentIdEkthesis();
    let current_ekthesis = model.getCurrentEkthesiIdtitle();

    res.render('admin-main', { layout: 'admin', erga: JSON.stringify(erga), ektheseis: JSON.stringify(current_ekthesis), css: cssFilePath });

});

//Δημιουργώ διαδρομή για το editing του κάθε έργου
router.get("/admin/edit/:arithmos_ergou", logInController.checkAuthenticated, (req, res) => {
    const cssFilePath = '/admin-style.css'
    let ergo_info = model.getErgo(req.params.arithmos_ergou);
    res.render('admin-edit', { layout: 'admin', info: ergo_info, css: cssFilePath });
});

router.post("/admin/edit/:arithmos_ergou/submit", logInController.checkAuthenticated, (req, res) => {
    let info = req.body;
    console.log(info);
    model.updateErgo(info.code, info.content, info.type, info.title, info.artist, info.size, info.date);
    res.redirect('/admin/edit');
});

//Δημιουργώ διαδρομή για την προσθήκη ενός έργου
router.get("/admin/addPainting", logInController.checkAuthenticated, (req, res) => {
    const cssFilePath = '/admin-style.css'
    let aithouses = model.getAithouses();
    res.render('admin-add', { layout: 'admin', aithouses: aithouses, css: cssFilePath });
});

//Submit για την προσθήκη του έργου
router.post("/admin/addPainting/submit", logInController.checkAuthenticated, (req, res) => {
    let info = req.body;
    console.log(info);
    if (model.checkAvailableIdErgou(info.code) === undefined) {
        model.insertNewErgo(info.code, info.link, info.date, info.size, info.type, info.title, info.content, info.artist);
        res.redirect('/admin/edit');
    }
    else {
        res.redirect('/admin/addPainting');


    }

});

//Διαδρομή για την διαγραφή του έργου
router.get("/admin/delete/:arithmos_ergou", logInController.checkAuthenticated, (req, res) => {
    model.deleteErgo(req.params.arithmos_ergou);
    res.redirect('/admin/edit');
});


//**ΕΚΘΕΣΕΙΣ *//

//Δημιουργώ διαδρομή για τις εκθέσεις
router.get("/admin/Exhibitions", logInController.checkAuthenticated, (req, res) => {
    const cssFilePath = '/admin-exh.css'
    let future_exh = model.getFutureExhibitions();
    let current_exh = model.getAllCurrentEktheseis();
    //console.log(exh);
    res.render('admin-exhibitions', { layout: 'admin', css: cssFilePath, future_exh: JSON.stringify(future_exh), current_exh: JSON.stringify(current_exh) });
})

//Προβολή τωρινής έκθεσης
router.get("/admin/viewExhibition/:id_ekthesis", logInController.checkAuthenticated, (req, res) => {
    const cssFilePath = '/admin-exh.css'
    let ekthes = model.getEkthesiById(req.params.id_ekthesis);
    let aithousa = model.getScheduleAithousas(ekthes.id_aithousas);
    let erga_exh = model.gettheEkthesisErga(req.params.id_ekthesis);
    //console.log(ekthes);
    //console.log(aithousa);
    res.render('admin-view-exh', { layout: 'admin', ekthes: ekthes, erga_exh: erga_exh, aithousa: aithousa, css: cssFilePath });
})

//Επεξεργασία μελλοντικής έκθεσης
router.get("/admin/updateExhibition/:id_ekthesis", logInController.checkAuthenticated, (req, res) => {
    const cssFilePath = '/admin-exh.css'
    let ekthes = model.getEkthesiById(req.params.id_ekthesis);
    let aithousa = model.getScheduleAithousas(ekthes.id_aithousas);
    let erga_exh = model.gettheEkthesisErga(req.params.id_ekthesis);
    //console.log(aithousa);
    res.render('admin-update-exh', { layout: 'admin', ekthes: ekthes, erga_exh: erga_exh, aithousa: JSON.stringify(aithousa), css: cssFilePath });
})

//Αποθήκευση επεξεργασίας έκθεσης
router.post("/admin/updateExhibition/:id_ekthesis/submit", logInController.checkAuthenticated, (req, res) => {
    let info = req.body;
    //console.log(info);

    let dates = info.imerom.split(' to ');

    // Assign the dates to separate variables
    let imer_enarx = dates[0].trim();
    let imer_lixis = dates[1].trim();
    info.imer_enarx = imer_enarx;
    info.imer_lixis = imer_lixis;
    model.updateEkthesi(req.params.id_ekthesis, info.title, info.content, info.imer_enarx, info.imer_lixis, info.link);

    res.redirect("/admin/Exhibitions");
})

//Διαγραφή Έκθεσης
router.get("/admin/deleteExhibition/:id_ekthesis", logInController.checkAuthenticated, (req, res) => {
    model.deleteEkthesi(req.params.id_ekthesis);
    res.redirect('/admin/Exhibitions');
});

//Διαγραφή έργου από έκθεση
router.get("/admin/deletePaintingFromExhibition/:id_ekthesis/:arithmos_ergou", logInController.checkAuthenticated, (req, res) => {
    model.afairesiErgouapoEkthesi(req.params.arithmos_ergou, req.params.id_ekthesis);
    console.log(req.params.arithmos_ergou, req.params.id_ekthesis);
    res.redirect('/admin/Exhibitions');
});

//Προσθήκη Νέας Έκθεσης
router.get("/admin/addExhibition", logInController.checkAuthenticated, (req, res) => {
    const cssFilePath = '/add-exhibition.css'
    let sched = model.getFullAithousesSchedule();
    //console.log(sched);
    res.render('admin-add-exhibition', { layout: 'admin', ex_info: ex_info, sched: JSON.stringify(sched), css: cssFilePath });

});


//Submit της πρώτης φάσης της προσθήκης
router.post("/admin/addExhibition/submit", logInController.checkAuthenticated, (req, res) => {
    ex_info = req.body;
    console.log(ex_info);
    let dates = ex_info.imerom.split(' to ');

    // Assign the dates to separate variables
    let imer_enarx = dates[0].trim();
    let imer_lixis = dates[1].trim();
    ex_info.imer_enarx = imer_enarx;
    ex_info.imer_lixis = imer_lixis;

    res.redirect('/admin/addExhibition2');
});

//Προσθήκη Έργων στην Έκθεση
router.get("/admin/addExhibition2", logInController.checkAuthenticated, (req, res) => {

    const cssFilePath = '/add-exhibition-2.css'
    let erga = model.availableErga(ex_info.imer_enarx, ex_info.imer_liksis);
    res.render('admin-add-exhibition-2', { layout: 'admin', erga: erga, css: cssFilePath });

});

//Τελική υποβολή προσθήκης έκθεσης
router.post("/admin/addExhibition2/submit", logInController.checkAuthenticated, (req, res) => {
    res.json({ success: true });

    let info = req.body;
    //console.log(info);
    model.newPeriodikiEkthesi(ex_info.title, ex_info.perigrafi, ex_info.imer_enarx, ex_info.imer_lixis, ex_info.link, ex_info.aithousa);
    let id_ekthesis = model.getIdofLastEkthesis();
    for (let i = 0; i < info.length; i++) {
        model.insertErgotoEkthesi(info[i].arithmos_ergou, id_ekthesis["id_ekthesis"], ex_info.imer_enarx, ex_info.imer_lixis);
    }

});



//Άνοιγμα Εφαρμογής
app.listen(port, () => console.log(`Open Vincent Van Gogh Gallery http://localhost:${port}/ `));
console.log(`Open Admin Page http://localhost:${port}/admin/login`);