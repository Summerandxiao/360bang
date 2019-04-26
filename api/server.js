const express = require("express");
const path = require("path");
const fs = require("fs");

const db = require(__dirname + "/module/db.js");
const common = require(__dirname + "/module/common.js");
const config = require(__dirname + "/module/config.js");
const app = express();
const {
	upPic
} = require("./module/upPic"); //{upPic:xxx}

app.use(express.static(path.resolve(__dirname, "../manage")));
app.use(express.static(path.resolve(__dirname, "./upload")));
app.use(express.static(path.resolve(__dirname, "../html")));

// 获得图片在数据库当中存的位  advPic year/month/picName.xxx
//广告
//添加
app.post("/adv", function(req, res) {
	upPic(req, "advPic", function(obj) {
		if(obj.ok === 1) { // 上传图片
			db.insertOne("advList", {
				advName: obj.params.advName,
				addTime: common.getNowTime(),
				advPic: obj.params.newPicPath,
				advHref: obj.params.advHref,
				orderBy: obj.params.orderBy / 1,
				advType: obj.params.advType / 1
			}, function(err, results) {
				if(err)
					common.send(res);
				else
					common.send(res, 1, "成功");
			})
		} else
			common.send(res, -1, obj.msg);
	})

})
app.get("/adv", function(req, res) {
	// 分页
	db.find("advList", {
		sortObj: {
			orderBy: -1,
			addTime: -1
		}
	}, function(err, advList) {
		res.json({
			ok: 1,
			advList,
			advTypeEnum: config.advTypeEnum
		})
	})
})
// 删除
app.delete("/adv/:id", function(req, res) {
	db.findOneById("advList", req.params.id, function(err, advInfo) {
		// console.log(advInfo);
		fs.unlink(__dirname + "/upload/" + advInfo.advPic, function(err) {
			db.deleteOneById("advList", req.params.id, function(err, results) {
				common.send(res, 1, "删除成功")
			})
		})
	})
})
//根据ID获得广告信息；
app.get("/advInfoById", function(req, res) {
	db.findOneById("advList", req.query.id, function(err, advInfo) {
		res.json({
			ok: 1,
			advInfo
		})
	})
})
//通过下面方法验证是否要删除图片，若是，删除，若不是，不删除
function upAdv(ok, id, params, cb) {
	var upObj = {
		advName: params.advName,
		advHref: params.advHref,
		advType: params.advType / 1,
		orderBy: params.orderBy

	}
	if(ok === 1) {
		db.findOneById("advList", id, function(err, advInfo) {
			fs.unlink(__dirname + "/upload/" + advInfo.advPic, function(err) {
				upObj.advPic = params.newPicPath;
				cb(upObj);
			})
		})
	} else {
		cb(upObj)
	}
}
//修改
app.put("/adv/:id", function(req, res) {
	upPic(req, "advPic", function(obj) {
		if(obj.ok === 3) {
			common.send(res, -1, obj.msg)
		} else {
			upAdv(obj.ok, req.params.id, obj.params, function(upObj) {
				db.updateOneById("advList", req.params.id, upObj, function(err) {
					common.send(res, 1, "修改成功")
				})
			})
		}
	})
})
//查找广告
app.get("/advInfoByType", function(req, res) {
	// advType   limit
	var advType = req.query.advType / 1;
	var limit = req.query.limit / 1;
	db.find("advList", {
		whereObj: {
			advType
		},
		limit,
		sortObj: {
			orderBy: -1,
			addTime: 1
		}
	}, function(err, advList) {
		if(err) {
			common.send(res);
		} else {
			res.json({
				ok: 1,
				advList
			})
			//console.log(advList);
		}
	})
})

//商品
app.post("/goods", function(req, res) {
	upPic(req, "gdsPic", function(obj) {
		if(obj.ok === 1) { // 上传图片
			var goods = obj.params;
			db.insertOne("gdsList", {
				gdsName: goods.gdsName,
				addTime: common.getNowTime(),
				gdsPic: goods.newPicPath,
				gdsPrice: goods.gdsPrice,
				orderBy: obj.params.orderBy / 1

			}, function(err, results) {
				if(err)
					common.send(res);
				else
					common.send(res, 1, "成功");
			})
		} else
			common.send(res, -1, obj.msg);
	})

})
app.get("/goods", function(req, res) {
	// 分页
	db.find("gdsList", {
		sortObj: {
			orderBy: -1,
			addTime: -1
		}
	}, function(err, gdsList) {
		res.json({
			ok: 1,
			gdsList,

		})
	})
})
// 删除
app.delete("/goods/:id", function(req, res) {
	db.findOneById("gdsList", req.params.id, function(err, gdsInfo) {
		// console.log(advInfo);
		fs.unlink(__dirname + "/upload/" + gdsInfo.gdsPic, function(err) {
			db.deleteOneById("gdsList", req.params.id, function(err, results) {
				common.send(res, 1, "删除成功")
			})
		})
	})
})

//通过下面方法验证商品是否要删除图片，若是，删除，若不是，不删除

function upGds(ok, id, params, cb) {
	var upObj = {
		gdsName: params.advName,
		gdsPrice: params.gdsPrice,
		orderBy: params.orderBy
}
	if(ok === 1) {
		db.findOneById("gdsList", id, function(err, gdsInfo) {
			fs.unlink(__dirname + "/upload/" + gdsInfo.gdsPic, function(err) {
				upObj.gdsPic = params.newPicPath;
				cb(upObj);
			})
		})
	} else {
		cb(upObj)
	}
}
//修改商品
app.put("/goods/:id",function(req,res){
	upPic(req,"gdsPic",function(obj){
		if(obj.ok === 3){
			common.send(res,-1,obj.msg)
		}else{
			upGds(obj.ok,req.params.id,obj.params,function(upObj){
				db.updateOneById("gdsList",req.params.id,upObj,function(err){
					common.send(res,1,"修改成功")
				})
			})
		}
	})
})

//根据ID获得商品信息；
app.get("/gdsInfoById", function(req, res) {
	db.findOneById("gdsList", req.query.id, function(err, gdsInfo) {
		res.json({
			ok: 1,
			gdsInfo
		})
	})
})
//渲染，向数据库提取数据
app.get("/goodsLimit", function(req, res) {
	//order    limit
     var order = req.query.order/1;
	var limit = req.query.limit / 1;
	db.find("gdsList", {
	     whereObj:{
	     	orderBy:order
	     },
		limit,
		sortObj: {
			orderBy: -1,
			addTime: 1
		}
	}, function(err, gdsList) {
		if(err) {
			common.send(res);
		} else {
			res.json({
				ok: 1,
				gdsList
			})
			console.log(gdsList);
		}
	})
})

app.listen(80, function() {
	console.log("success")
})