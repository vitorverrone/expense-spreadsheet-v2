import Bill from '../models/billModel.js';

export const getBillsFromUser = async (req, res) => {
    const { id } = req.params;

    try {
        const bills = await Bill.find({ userId: id })
        res.status(200).json(bills)
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

export const getBillsFromUserWithFilters = async (req, res) => {
    const { id, month, search } = req.params;

    const date = new Date();
    const year = date.getFullYear();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year + 30, month, 1);

    let filters = {
        $or: [
            {
                finalDate: {
                    $gte: startDate,
                    $lt: endDate,
                }
            },
            { billType: 'recurrent' }
        ]
    };

    if (search) {
        filters.title = { $regex: search, $options: 'i' }
    }

    try {
        const bills = await Bill.find({ userId: id }).or(filters);
        res.status(200).json(bills)
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

export const createBill = async (req, res) => {
    const { userId, title, value, installments, billType, finalDate, cardId } = req.body;

    try {
        const bill = await Bill.create({ userId, title, value, installments, billType, finalDate, cardId })
        res.status(200).json({ bill });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

export const deleteBill = async (req, res) => {
    const { id } = req.params;

    try {
        await Bill.findByIdAndDelete(id);
        res.status(200).json({ msg: 'bill deleted', success: true });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}
