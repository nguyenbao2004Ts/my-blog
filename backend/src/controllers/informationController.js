const informationModel = require('../models/informationModel');

class informationController {
    async getAllInformation(req, res) {
        try {
            const informations = await informationModel.find({});
            res.json(informations);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async createInformation(req, res) {
        try {
            const newInformation = new informationModel(req.body);
            await newInformation.save();
            res.json(newInformation);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async deleteInformationById(req, res) {
        try {
            const deleteInformation = await informationModel.findByIdAndDelete(req.params.id);
            if (!deleteInformation) {
                return res.status(404).json({ message: "Không tìm thấy dữ liệu" });
            }
            res.json({ message: "dữ liệu đã xóa" });
        } catch (err) {
            res.status(500).json({ message: "Lỗi không xóa được dữ liệu" });
        }
    }

    async updateInformationById(req, res) {
        try {
            const updateInformation = await informationModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }  // Trả về dữ liệu mới cập nhật
            );
            if (!updateInformation) {
                return res.status(404).json({ message: "Không tìm thấy dữ liệu" });
            }
            res.json(updateInformation);  // Trả về dữ liệu cập nhật
        } catch (err) {
            res.status(500).json({ message: "Lỗi không cập nhật được dữ liệu" });
        }
    }
    
}

module.exports = new informationController();
