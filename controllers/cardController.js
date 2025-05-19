import Card from '../models/cardModel.js';

export const getCardsFromUser = async (req, res) => {
    const { id } = req.params;

    try {
        const cards = await Card.find({ userId: id })
        res.status(200).json(cards)
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

export const createCard = async (req, res) => {
    const { userId, nickname, closingDay } = req.body;

    try {
        const card = await Card.create({ userId, nickname, closingDay })
        res.status(200).json({ card });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

export const deleteCard = async (req, res) => {
    const { id } = req.params;

    try {
        await Card.findByIdAndDelete(id);
        res.status(200).json({ msg: 'card deleted', success: true });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}
