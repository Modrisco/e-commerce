var models = require('../models')

module.exports = {
    create_user(req, res) {

        //TODO validation and password encryption
        models.user.create({
            userName: req.body.username,
            Password: req.body.password,
            Role: req.body.role,
            Gender: req.body.gender,
            Date_of_birth: req.body.birthday,
            Address: req.body.address,
            Email_address: req.body.email,
            Phone_number: req.body.phone,
        }).then(function (value) {
            if (value) {
                console.log('success')
                res.json({data: 'success'});
            }
        }).catch(function (reason) {
            console.log(reason);
            res.json({error: reason});
        });
    },
    login(req, res) {
        models.user.find({
            where: {
                userName: req.body.username,
                Password: req.body.password
            },
            include: {
                model: models.product,
                attributes: [[models.sequelize.fn('COUNT', models.sequelize.col('productName')), 'items']],
                // through: {
                //     where: {status: 'pending'}
                // }
            }
        }).then(data => {
            // console.log(data.products)
            if (data) {
                //TODO cookie
                // res.cookie('userId', data.dataValues.id)
                res.json({data: data})
            } else {
                res.json({error: 'invalid username or password'})
            }
        }).catch(error => {
            console.log(error)
        })

    },
    getCartItems(req, res) {
        console.log(req.query)
        models.user.findOne({
            where: {
                id: req.query.user_id
            },
            include: {
                model: models.product,
                attributes: ['id', 'productName', 'imagePath', 'productPrice'],
                // through: {
                //     where: {status: 'pending'}
                // }
            }
        }).then(value => {
            console.log(value)
            res.json({data: value.products})
        }).catch(error => {
            console.log(error)
            res.json({error})
        })
    },
    updateCart(req, res) {
        let param = {};
        if (req.body.count) {
            param.count=req.body.count;
        }
        if (req.body.status) {
            param.status=req.body.status;
        }
        models.carts.update(
            param,
            {
                where:{
                    user_id:req.body.user_id,
                    product_id:req.body.product_id
                }
            }
        ).then(value =>{
            res.json({status:'success'})
        }).catch(error => {
            res.json({error})
        })
    },
    deleteCartItem(req, res){
        models.carts.destroy({
            where: {
                user_id: req.body.user_id,
                product_id: req.body.product_id
            }
        }).then(value =>{
            res.json({status:'success'})
        }).catch(error => {
            res.json({error})
        })
    },
    selectAllCartItem(req,res){

        models.carts.update(
            {status:req.body.selectAll?'checked':'pending'},
            {
                where:{
                    user_id:req.body.user_id,
                }
            }
        ).then(value =>{
            res.json({status:'success'})
        }).catch(error => {
            res.json({error})
        })
    },
    getAddress(req, res) {
        console.log(req.query)
        models.user.findOne({
            where: {
                id: req.query.user_id
            },
            attributes: ['id'],
            include: {
                model: models.address,
                as:'userInfo',
                // attributes: [],
                // through: {
                //     where: {status: 'pending'}
                // }
            }
        }).then(value => {
            console.log(value.userInfo[0])
            res.json({data: value.userInfo})
        }).catch(error => {
            console.log(error)
            res.json({error})
        })
    },
    async setDefaultAddress(req, res) {
        try{
            await models.address.update({
                isDefault :0
            },{
                where:{
                    userInfo:req.body.user_id
                }
            })
        }catch(error){
            res.json({error})
            return
        }
        try{
            await models.address.update({
                isDefault :1
            },{
                where:{
                    id:req.body.address_id
                }
            })
        }catch(error){
            res.json({error})
            return
        }
        res.json({status:'succ'})
    }
}