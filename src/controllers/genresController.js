const db = require('../database/models');
const sequelize = db.sequelize;


const genresController = {
    'list': async (req, res) => {
      try { 
            let {order = "id"} = req.query;
            let orders = ["id", "name","ranking"];

            if (!orders.includes(order)){
                throw new Error ("El campo " + order + " no existe. Los campos disponibles son name y ranking."
            )}

            let genres = await db.Genre.findAll({
            order:[order],
            attributes: { 
                include: [
                    {
                        association: "genre",
                        attributes: ["name"]
                    }
                ],
                exclude: 
                     ["created_at", "updated_at"]
                }
            })
            if(genres) {return res.status(200).json({
                ok:true,
                data: genre,
                meta: {
                    total:1
                }
            })
        }
            throw new Error ("No se encuentra el género.")
    }

    catch(error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: error.message? error.message : "Hubo un error"
        })
    }
},

    'detail': async(req, res) => {            
                try { 
                
                const{id}=req.params;
                if(isNaN(id)){
                    throw new Error ("El ID debe ser un número")
                };
                                
                let genre = await db.Genre.findByPk(req.params.id,{
                        attributes: { 
                        exclude: 
                             ["created_at", "updated_at"]
                        }
                    });

                    if(genre){
                        return res.status(200).json({
                        ok:true,
                        data: genre,
                       
                    })
                }
                    throw new Error ("No se encuentra el género")
            }
        
            catch(error) {
                console.log(error)
                return res.status(500).json({
                    ok: false,
                    msg: error.message? error.message : "Hubo un error"
                })
            }
        },
}

module.exports = genresController;