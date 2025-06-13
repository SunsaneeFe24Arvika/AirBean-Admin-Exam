import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const menuSchema = new Schema(
	{
		prodId: {
			type: String,
			required: true,
			unique: true,
		},
		title: {
			type: String,
			required: true,
		},
		desc: {
			type: String,
			required: true,
		},
		baseUrl : {
        type : String,
		},
		price: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

const Menu = mongoose.model('Menu', menuSchema, 'Menu');

export default Menu;
