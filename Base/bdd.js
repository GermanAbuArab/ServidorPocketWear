const MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');
const urlMongo = 'mongodb+srv://Gabuarab:german118431@appmobilesej1-lirw3.gcp.mongodb.net/?retryWrites=true&w=majority';
const base = "PocketWear";

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
        res.status(200)
        res.end(JSON.stringify(data.password));
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
    const findItem = async () => {
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
    findItem().then((data) => {
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


module.exports = {createUser, findOneUser, findOneUserByMail, createItem, findInventory};

//Todo acordarse de exportar todos los methodos