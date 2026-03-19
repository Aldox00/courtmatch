const { Lugar, Deporte } = require('../models/index'); 

const crearLugar = async (req, res) => {
    try {
        const { nombre, direccion, idDeporte } = req.body;

        if (!nombre || !idDeporte) {
            return res.status(400).json({ 
                error: 'Faltan datos. Asegúrate de enviar nombre e idDeporte.' 
            });
        }

        const nuevoLugar = await Lugar.create({ nombre, direccion, idDeporte });
        
        res.status(201).json({
            mensaje: 'Lugar creado con éxito',
            lugar: nuevoLugar
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Este lugar ya está registrado con esos datos.' });
        }
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({ error: 'El deporte seleccionado no existe en la base de datos.' });
        }
        console.error('Error al crear lugar:', error);
        res.status(400).json({ error: error.message });
    }
};

const obtenerLugares = async (req, res) => {
    try {
        const lugares = await Lugar.findAll({
            include: [
                {
                    model: Deporte,
                    attributes: ['nombreDeporte'] 
                }
            ]
        }); 
        res.json(lugares);
    } catch (error) {
        console.error('Error al obtener lugares:', error);
        res.status(500).json({ error: 'Hubo un error al obtener los lugares' });
    }
};

module.exports = { crearLugar, obtenerLugares };