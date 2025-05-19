import User from '../models/userModel.js';

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username: username })

        if(user){
            if (user.password === password){
                res.status(200).json({ success: true, user });
            } else {
                res.status(200).json({ success: false, msg: 'Usuário ou senha inválidos' })
            }
        } else {
            res.status(200).json({ success: false, msg: 'Usuário ou senha inválidos' })
        }
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

export const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id)
        res.status(200).json({ user })
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

export const createUser = async (req, res) => {
    const { name, nickname, password } = req.body;

    try {
        const user = await User.create({ name, nickname, password })
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}
