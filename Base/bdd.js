const MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');
const urlMongo = 'mongodb+srv://Gabuarab:german118431@appmobilesej1-lirw3.gcp.mongodb.net/?retryWrites=true&w=majority';
const base = "PocketWear";


const mailgun = require("mailgun-js");
const api_key = "aa7f783ea12e269c541be9dec4c541bf-ffefc4e4-6b045567";
const to = "rodri.lopez98@gmail.com";
const DOMAIN = 'sandbox0da9547765d6425295506e7df696feb1.mailgun.org';
const mg = mailgun({apiKey: api_key, domain: DOMAIN});


createUser = async (req, res) => {  //todo hacer que devuelva el usuario con id y todo
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Acces-Control-Allow-Methods', 'POST');
    var user = {
        user: req.body.user,
        password: req.body.password,
        email: req.body.email,
    };
    const insertUser = async () => {
        const client = await MongoClient.connect(urlMongo, {useUnifiedTopology: true});
        try {
            const response = await client.db(base).collection("User").insertOne(user);
            res.statusCode = 200;
            client.close();
            console.log(response)
            return response.ops[0];
        } catch (e) {
            throw e;
        } finally {
            client.close();
        }
    };
    insertUser().then((data) => {
        res.end(JSON.stringify(data));
    })
        .catch((err) => {
            if (err.name === 'MongoError') {
                if (err.code === 11000) {
                    if (err.keyValue.email !== undefined)
                        return res.status(404).send({
                            message: "Ya existe un usuario con ese mail"
                        });
                    if (err.keyValue.user !== undefined)
                        return res.status(404).send({
                            message: "Ya existe un usuario con ese nombre de usuario"
                        });
                }
            }
            return res.status(500).send({
                message: "Error interno del servidor"
            });

        })
};

findOneUser = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Acces-Control-Allow-Methods', 'GET');
    const findUser = async () => {
        const client = await MongoClient.connect(urlMongo, {useUnifiedTopology: true});
        try {
            const user = await client
                .db(base)
                .collection("User")
                .findOne({user: req.params.user}, {projection: {}});
            return user;
        } catch (err) {
            throw err;
        } finally {
            client.close();
        }
    };
    findUser().then((data) => {
        if (data === null) {
            return res.status(404).send({
                message: "No se encontro un usuario con ese Nombre de Usuario"
            });
        }
        res.status(200)
        res.end(JSON.stringify(data));
    })
        .catch((err) => {
            console.log(err)
            return res.status(500).send({
                message: "Error interno del servidor"
            });

        })
};

findOneUserByMail = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Acces-Control-Allow-Methods', 'GET');
    const findUser = async () => {
        const client = await MongoClient.connect(urlMongo, {useUnifiedTopology: true});
        try {
            const user = await client
                .db(base)
                .collection("User")
                .findOne({email: req.params.mail}, {projection: {}});
            return user;
        } catch (err) {
            throw err;
        } finally {
            client.close();
        }
    };
    findUser().then((data) => {
        if (data === null) {
            return res.status(404).send({
                message: "No se encontro un usuario con este Mail"
            });
        }
        const mail = {
            from: 'support@pocketwear.com',
            to: data.email,
            subject: 'Olvide mi Contraseña',
            text: data.user + '_:\n' +
                'Si recibió este correo es porque solicitó un recordatorio de contraseña. Esta es ' + data.password + '\n' +
                'Si no solicitó el mail o cree que lo recibió por error, ignore este mensaje.' +
                'Saludos,\n' +
                'El equipo de Pocket Wear.'
        };
        mg.messages().send(mail, function (error, body) {
            console.log(body);

            if (error) {
                console.log(error);
                res.status(400)
                res.end(JSON.stringify("No se pudo mandar el mail Error:" + error));
            } else {
                res.status(200)
                console.log('Email sent: ' + info.response);
                res.end(JSON.stringify(data.password));
            }
        });
    })
        .catch((err) => {
            console.log(err)
            return res.status(500).send({
                message: "Error interno del servidor"
            });

        })
};

createItem = async (req, res) => {  //todo hacer que devuelva el usuario con id y todo
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Acces-Control-Allow-Methods', 'POST');
    var item = {
        type: req.body.type,
        color: req.body.color,
        season: req.body.season,
        store: req.body.store,
        user: req.body.user,
        img: req.body.image

    };

    const insertItem = async () => {
        const client = await MongoClient.connect(urlMongo, {useUnifiedTopology: true});
        try {
            const response = await client.db(base).collection("Item").insertOne(item);
            return response.ops[0];
        } catch (e) {
            throw e;
        } finally {
            client.close();
        }
    };
    /*
    const insertImage = async (data) => {
        var imagen ={
            item: data._id,
            img: req.body.image
        }
        const client = await MongoClient.connect(urlMongo, {useUnifiedTopology: true});
        try {
            const response = await client.db(base).collection("Img").insertOne(imagen);
            res.statusCode = 200;
            client.close();
            console.log(response)
            return response.ops[0];
        } catch (e) {
            throw e;
        } finally {
            client.close();
        }
    };*/
    insertItem().then((data) => {
        console.log(data)
        var respuesta = {
            _id: data._id,
            type: data.type,
            color: data.color,
            store: data.store,
            season: data.season,
            image: data.image
        };
        res.end(JSON.stringify(respuesta));
    })
        .catch((err) => {
            console.log(err)
            if (err.name === 'MongoError') {
                if (err.code === 11000) {
                    if (err.keyValue.email !== undefined)
                        return res.status(404).send({
                            message: "Ya existe un usuario con ese mail"
                        });
                    if (err.keyValue.user !== undefined)
                        return res.status(404).send({
                            message: "Ya existe un usuario con ese nombre de usuario"
                        });
                }
            }
            return res.status(500).send({
                message: "Error interno del servidor"
            });
        });
};

findInventory = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Acces-Control-Allow-Methods', 'GET');
    const findItems = async () => {
        const client = await MongoClient.connect(urlMongo, {useUnifiedTopology: true});
        try {
            const items = await client
                .db(base)
                .collection("Item")
                .find({user: req.params.user}, {projection: {}}).toArray();
            return items;
        } catch (err) {
            throw err;
        } finally {
            client.close();
        }

    };
    findItems().then((data) => {
        if (data.length === 0) {
            return res.status(404).send({
                message: "No se encontro un Inventario para este Usuario"
            });
        }
        res.status(200);
        res.end(JSON.stringify(data));
    })
        .catch((err) => {
            console.log(err)
            return res.status(500).send({
                message: "Error interno del servidor"
            });

        });
};

findColorsItems = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Acces-Control-Allow-Methods', 'GET');
    const findColors = async () => {
        const client = await MongoClient.connect(urlMongo, {useUnifiedTopology: true});
        try {
            const colores = await client
                .db(base)
                .command({distinct: "Item", key: "color"});
            return colores.values;
        } catch (err) {
            throw err;
        } finally {
            client.close();
        }

    };
    findColors().then((data) => {
        if (data.length === 0) {
            return res.status(404).send({
                message: "No se encontro ningun Color"
            });
        }
        res.status(200);
        res.end(JSON.stringify(data));
    })
        .catch((err) => {
            console.log(err)
            return res.status(500).send({
                message: "Error interno del servidor"
            });

        });
};

findStoresItems = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Acces-Control-Allow-Methods', 'GET');
    const findStores = async () => {
        const client = await MongoClient.connect(urlMongo, {useUnifiedTopology: true});
        try {
            const stores = await client
                .db(base).command({distinct: "Item", key: "store"});
            return stores.values;
        } catch (err) {
            throw err;
        } finally {
            client.close();
        }

    };
    findStores().then((data) => {
        if (data.length === 0) {
            return res.status(404).send({
                message: "No se encontro ningun Color"
            });
        }
        res.status(200);
        res.end(JSON.stringify(data));
    })
        .catch((err) => {
            console.log(err)
            return res.status(500).send({
                message: "Error interno del servidor"
            });

        });
};


findTheItem = async (req, res) => { //todo cambiar
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Acces-Control-Allow-Methods', 'POST');

    var type = req.body.type;
    var color = req.body.color;
    var season = req.body.season;
    var store = req.body.store;
    var filtros = {};
    if (type) {
        filtros.type = type;
    }
    if (color) {
        filtros.color = color;
    }
    if (season) {
        filtros.season = season;
    }
    if (store) {
        filtros.store = store;
    }
    console.log(filtros);
    const findItems = async () => {
        const client = await MongoClient.connect(urlMongo, {useUnifiedTopology: true});
        try {
            const items = await client
                .db(base)
                .collection("Item")
                .find(filtros, {projection: {}}).sort({_id: -1}).limit(21).toArray();
            return items;
        } catch (err) {
            throw err;
        } finally {
            client.close();
        }

    };
    findItems().then((data) => {
        if (data.length === 0) {
            return res.status(404).send({
                message: "No se encontro ninguna Prenda"
            });
        }
        res.status(200);
        res.end(JSON.stringify(data));
    })
        .catch((err) => {
            console.log(err)
            return res.status(500).send({
                message: "Error interno del servidor"
            });

        });
};

findLastItems = async (req, res) => { //todo deberia andar , pero me siento mal para probarlo creo que el limit no funciona asi
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Acces-Control-Allow-Methods', 'GET');
    const findStores = async () => {
        const client = await MongoClient.connect(urlMongo, {useUnifiedTopology: true});
        try {
            const ultimos = await client
                .db(base)
                .collection("Item")
                .find({}, {projection: {}}).sort({_id: -1}).limit(21).toArray();
            return ultimos;
        } catch (err) {
            throw err;
        } finally {
            client.close();
        }

    };
    findStores().then((data) => {
        if (data.length === 0) {
            return res.status(404).send({
                message: "No se encontro ninguna Prenda"
            });
        }
        res.status(200);
        res.end(JSON.stringify(data));
    })
        .catch((err) => {
            console.log(err)
            return res.status(500).send({
                message: "Error interno del servidor"
            });

        });
};


module.exports = {
    createUser,
    findOneUser,
    findOneUserByMail,
    createItem,
    findInventory,
    findColorsItems,
    findStoresItems,
    findTheItem,
    findLastItems
};

//Todo acordarse de exportar todos los methodos